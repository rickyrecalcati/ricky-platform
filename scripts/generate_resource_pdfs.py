#!/usr/bin/env python3
"""Generate branded resource PDFs from the editable Markdown source files."""

from pathlib import Path
import re
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    CondPageBreak,
    Flowable,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
RESOURCE_DIR = ROOT / "public" / "resources"

BLACK = colors.HexColor("#090909")
CARD_BLACK = colors.HexColor("#111111")
CREAM = colors.HexColor("#F4EFE6")
GOLD = colors.HexColor("#C7A347")
SOFT_GREY = colors.HexColor("#A7A7A7")
INK = colors.HexColor("#25231F")
RULE = colors.HexColor("#D8D0C1")
PAPER = colors.HexColor("#FCFAF5")
CONTENT_WIDTH = 166 * mm
CONTENT_HEIGHT = A4[1] - 47 * mm
MAJOR_SECTION_LIMIT = CONTENT_HEIGHT - 6 * mm
SECTION_START_MINIMUM = 72 * mm
CONTINUATION_CHUNK_LIMIT = 178 * mm
FORCED_PAGE_BREAK_BEFORE = {"Continue Exploring"}

RESOURCES = (
    ("weekly-business-review", "Weekly Business Review"),
    ("decision-framework", "Decision Framework"),
    ("business-health-scorecard", "Business Health Scorecard"),
    ("restaurant-opening-checklist", "Restaurant Opening Checklist"),
    ("restaurant-closing-checklist", "Restaurant Closing Checklist"),
    ("manager-handover-template", "Manager Handover Template"),
    ("chatgpt-prompt-pack-for-managers", "ChatGPT Prompt Pack for Managers"),
    ("ai-meeting-assistant", "AI Meeting Assistant"),
    ("ai-productivity-toolkit", "AI Productivity Toolkit"),
    ("annual-review-workbook", "Annual Review Workbook"),
    ("decision-journal", "Decision Journal"),
    ("reading-tracker", "Reading Tracker"),
)

WORKBOOK_FIELD_LABELS = {
    "Health",
    "Relationships",
    "Career",
    "Business",
    "Finances",
    "Personal Growth",
    "Happiness",
    "Contribution",
    "This year taught me…",
    "I was wrong about…",
    "I need to stop…",
    "I need to start…",
    "The best advice I received…",
    "Who brought energy into my life?",
    "Who drained it?",
    "Who deserves more time?",
    "Who should I reconnect with?",
    "Habits I Built",
    "Habits I Lost",
    "Habits I Want to Eliminate",
    "Next year I will stop…",
    "Because…",
    "Goal 1",
    "Goal 2",
    "Goal 3",
    "Why it matters",
    "First action",
    "Deadline",
    "Quarter 1",
    "Quarter 2",
    "Quarter 3",
    "Quarter 4",
    "Objectives",
    "Projects",
    "Habits",
    "This year mattered because…",
}

WORKBOOK_LONG_RESPONSE_LABELS = {
    "Write your five biggest achievements.",
    "List your biggest setbacks.",
    "Write ten things you’re grateful for.",
    "Describe your ideal year in these areas:",
    "Write a letter that you’ll read exactly one year from today.",
}

WORKBOOK_COMPACT_FIELD_LABELS = {
    "Health",
    "Relationships",
    "Career",
    "Business",
    "Finances",
    "Personal Growth",
    "Happiness",
    "Contribution",
    "Goal 1",
    "Goal 2",
    "Goal 3",
    "Why it matters",
    "First action",
    "Deadline",
    "Quarter 1",
    "Quarter 2",
    "Quarter 3",
    "Quarter 4",
    "Objectives",
    "Projects",
    "Habits",
}

DECISION_JOURNAL_EMPTY_SECTION_FIELDS = {
    "The Decision",
    "Why This Matters",
    "My Desired Outcome",
}

DECISION_JOURNAL_LONG_FIELD_LABELS = {
    "Which of these affects you most often?",
    "Which option am I choosing?",
    "Why?",
    "What could go wrong?",
    "How could I reduce these risks?",
    "I’m assuming that…",
    "If everything went wrong…",
    "What happened?",
    "What did I get right?",
    "What did I miss?",
    "What would I do differently?",
}

DECISION_JOURNAL_FIELD_LABELS = {
    "Confidence",
    "Evidence Quality",
    "Emotional Control",
    "Time Available",
    "Understanding of Risks",
    "Decision Number _______",
    "Date",
    "Option 1",
    "Option 2",
    "Option 3",
    "Pros",
    "Cons",
    "How likely are these?",
    "How certain am I?",
    "What would happen?",
    "How would I recover?",
    "Would I survive it?",
    "The strongest reason this decision succeeds is…",
    "The strongest reason it fails is…",
    "Date Reviewed",
    "Did the outcome match my expectations?",
    "Preparation",
    "Logic",
    "Execution",
    "Outcome",
    "Overall",
}


class WritingLines(Flowable):
    def __init__(self, count=2, width=165 * mm, gap=8 * mm):
        super().__init__()
        self.count = count
        self.line_width = width
        self.gap = gap
        self.height = count * gap

    def draw(self):
        self.canv.setStrokeColor(RULE)
        self.canv.setLineWidth(0.6)
        for index in range(self.count):
            y = self.height - ((index + 1) * self.gap) + 2 * mm
            self.canv.line(0, y, self.line_width, y)


class CheckboxItem(Flowable):
    def __init__(self, text, style, width=165 * mm):
        super().__init__()
        self.text = text
        self.style = style
        self.line_width = width
        self.paragraph = Paragraph(escape(text), style)
        _, paragraph_height = self.paragraph.wrap(width - 9 * mm, 30 * mm)
        self.height = max(7 * mm, paragraph_height + 2 * mm)

    def draw(self):
        box_size = 3.5 * mm
        self.canv.setStrokeColor(GOLD)
        self.canv.setLineWidth(0.8)
        self.canv.rect(0, self.height - box_size - 1.5 * mm, box_size, box_size)
        self.paragraph.drawOn(self.canv, 7 * mm, 1.2 * mm)


class SectionBlock(KeepTogether):
    """A named keep-together block used for deliberate PDF pagination."""


class NoteBlock(KeepTogether):
    """A prompt plus writable lines that must not split across pages."""


class SignatureBlock(KeepTogether):
    """Signature or sign-off fields that should stay with their labels."""


class ResourceTable(Table):
    """A branded table with repeatable headers for long future resources."""


class BlankDecisionTemplate(Flowable):
    def __init__(self, index):
        super().__init__()
        self.index = index
        self.height = CONTENT_HEIGHT - 8 * mm

    def draw_label(self, label, x, y):
        self.canv.setFillColor(INK)
        self.canv.setFont("Helvetica-Bold", 8)
        self.canv.drawString(x, y, label)

    def draw_lines(self, x, y, width, count, gap=6.6 * mm):
        self.canv.setStrokeColor(RULE)
        self.canv.setLineWidth(0.55)
        for line_index in range(count):
            line_y = y - ((line_index + 1) * gap)
            self.canv.line(x, line_y, x + width, line_y)
        return y - (count * gap) - 5 * mm

    def draw_field(self, label, x, y, width, count):
        self.draw_label(label, x, y)
        return self.draw_lines(x, y - 1 * mm, width, count)

    def draw(self):
        self.canv.setFillColor(BLACK)
        self.canv.setFont(SERIF_BOLD, 18)
        self.canv.drawString(0, self.height - 8 * mm, f"Blank Decision Template {self.index}")
        self.canv.setFillColor(colors.HexColor("#5F5A52"))
        self.canv.setFont("Helvetica", 7.8)
        self.canv.drawString(
            0,
            self.height - 15 * mm,
            "Use this page before making a meaningful decision. Return to it when the outcome becomes clear.",
        )

        left_x = 0
        right_x = 86 * mm
        col_width = 79 * mm
        left_y = self.height - 29 * mm
        right_y = self.height - 29 * mm

        left_y = self.draw_field("Decision", left_x, left_y, col_width, 2)
        left_y = self.draw_field("Context", left_x, left_y, col_width, 4)
        left_y = self.draw_field("Options", left_x, left_y, col_width, 5)
        left_y = self.draw_field("Risks", left_x, left_y, col_width, 3)
        left_y = self.draw_field("Assumptions", left_x, left_y, col_width, 3)

        right_y = self.draw_field("Final Choice", right_x, right_y, col_width, 3)
        right_y = self.draw_field("Confidence Rating", right_x, right_y, col_width, 1)
        right_y = self.draw_field("Future Review", right_x, right_y, col_width, 3)
        self.draw_field("Lessons Learned", right_x, right_y, col_width, 7)


class BookReviewTemplatePage(Flowable):
    def __init__(self, index, page_number):
        super().__init__()
        self.index = index
        self.template_page = page_number
        self.height = CONTENT_HEIGHT - 8 * mm

    def title(self, text, x, y, size=17):
        self.canv.setFillColor(BLACK)
        self.canv.setFont(SERIF_BOLD, size)
        self.canv.drawString(x, y, text)

    def label(self, text, x, y):
        self.canv.setFillColor(INK)
        self.canv.setFont("Helvetica-Bold", 7.7)
        self.canv.drawString(x, y, text)

    def body(self, text, x, y):
        self.canv.setFillColor(colors.HexColor("#5F5A52"))
        self.canv.setFont("Helvetica", 7.4)
        self.canv.drawString(x, y, text)

    def lines(self, x, y, width, count, gap=6 * mm):
        self.canv.setStrokeColor(RULE)
        self.canv.setLineWidth(0.55)
        for line_index in range(count):
            line_y = y - ((line_index + 1) * gap)
            self.canv.line(x, line_y, x + width, line_y)
        return y - (count * gap) - 4.5 * mm

    def field(self, label, x, y, width, count):
        self.label(label, x, y)
        return self.lines(x, y - 0.8 * mm, width, count)

    def checkbox(self, text, x, y):
        box_size = 3.2 * mm
        self.canv.setStrokeColor(GOLD)
        self.canv.setLineWidth(0.75)
        self.canv.rect(x, y - box_size + 1.2 * mm, box_size, box_size)
        self.body(text, x + 6 * mm, y)

    def draw_page_one(self):
        y = self.height - 7 * mm
        title = "Book Review" if self.index == 1 else f"Book Review {self.index}"
        self.title(title, 0, y)
        y -= 12 * mm
        self.title("Book Details", 0, y, size=13)
        y -= 8 * mm

        left_x = 0
        right_x = 88 * mm
        col_width = 77 * mm
        left_y = y
        right_y = y
        left_y = self.field("Title", left_x, left_y, col_width, 1)
        left_y = self.field("Author", left_x, left_y, col_width, 1)
        right_y = self.field("Date Started", right_x, right_y, col_width, 1)
        right_y = self.field("Date Finished", right_x, right_y, col_width, 1)
        right_y = self.field("Overall Rating", right_x, right_y, col_width, 1)
        self.body("⭐ 1 2 3 4 5", right_x, right_y + 3 * mm)

        y = min(left_y, right_y) - 2 * mm
        self.title("Why I Picked This Book", 0, y, size=13)
        y = self.field("Why I Picked This Book", 0, y - 8 * mm, CONTENT_WIDTH, 3)
        self.title("What did I hope to learn?", 0, y, size=13)
        y = self.field("What did I hope to learn?", 0, y - 8 * mm, CONTENT_WIDTH, 3)
        self.title("Summary", 0, y, size=13)
        self.body("Explain the book in your own words.", 0, y - 6 * mm)
        self.lines(0, y - 9 * mm, CONTENT_WIDTH, 8)

    def draw_page_two(self):
        y = self.height - 7 * mm
        self.title("Five Biggest Ideas", 0, y)
        y = self.lines(0, y - 2 * mm, CONTENT_WIDTH, 6)
        self.title("Favourite Quote", 0, y, size=13)
        y = self.lines(0, y - 2 * mm, CONTENT_WIDTH, 2)
        y = self.field("Why did it stand out?", 0, y, CONTENT_WIDTH, 2)
        self.title("What Changed My Thinking?", 0, y, size=13)
        y = self.lines(0, y - 2 * mm, CONTENT_WIDTH, 4)
        self.title("Three Actions I’ll Take", 0, y, size=13)
        y = self.field("Action 1", 0, y - 8 * mm, CONTENT_WIDTH, 1)
        y = self.field("Action 2", 0, y, CONTENT_WIDTH, 1)
        y = self.field("Action 3", 0, y, CONTENT_WIDTH, 1)
        self.title("Would I Recommend It?", 0, y, size=13)
        y -= 8 * mm
        self.checkbox("Definitely", 0, y)
        self.checkbox("Maybe", 34 * mm, y)
        self.checkbox("Probably Not", 62 * mm, y)
        self.field("Why?", 0, y - 9 * mm, CONTENT_WIDTH, 3)

    def draw(self):
        if self.template_page == 1:
            self.draw_page_one()
        else:
            self.draw_page_two()


class ReadingGoalsPage(Flowable):
    def __init__(self):
        super().__init__()
        self.height = CONTENT_HEIGHT - 8 * mm

    def title(self, text, x, y, size=18):
        self.canv.setFillColor(BLACK)
        self.canv.setFont(SERIF_BOLD, size)
        self.canv.drawString(x, y, text)

    def label(self, text, x, y):
        self.canv.setFillColor(INK)
        self.canv.setFont("Helvetica-Bold", 7.8)
        self.canv.drawString(x, y, text)

    def line(self, x, y, width):
        self.canv.setStrokeColor(RULE)
        self.canv.setLineWidth(0.55)
        self.canv.line(x, y, x + width, y)

    def field(self, label, x, y, width, count=1, gap=6.4 * mm):
        self.label(label, x, y)
        for index in range(count):
            self.line(x, y - ((index + 1) * gap), width)
        return y - (count * gap) - 5 * mm

    def checkbox(self, text, x, y):
        box_size = 3.1 * mm
        self.canv.setStrokeColor(GOLD)
        self.canv.setLineWidth(0.75)
        self.canv.rect(x, y - box_size + 1.2 * mm, box_size, box_size)
        self.canv.setFillColor(colors.HexColor("#5F5A52"))
        self.canv.setFont("Helvetica", 7.5)
        self.canv.drawString(x + 6 * mm, y, text)

    def draw(self):
        y = self.height - 8 * mm
        self.title("My Reading Goals", 0, y)
        y -= 10 * mm
        self.label("This Year I Want To:", 0, y)
        y -= 7 * mm
        y = self.field("Books to read:", 0, y, CONTENT_WIDTH, 2)
        y = self.field("Minutes per day:", 0, y, CONTENT_WIDTH, 1)
        self.label("Subjects I want to explore:", 0, y)
        y -= 7 * mm
        subjects = [
            "Business",
            "Leadership",
            "Finance",
            "Investing",
            "AI",
            "Personal Growth",
            "Psychology",
            "History",
            "Biography",
            "Fiction",
            "Philosophy",
            "Health",
        ]
        for index, subject in enumerate(subjects):
            col = index % 2
            row = index // 2
            self.checkbox(subject, col * 72 * mm, y - row * 6.5 * mm)
        y -= 44 * mm
        y = self.field("Other:", 0, y, CONTENT_WIDTH, 1)
        self.title("Reading Wishlist", 0, y, size=15)
        y -= 8 * mm
        y = self.field("Reading Wishlist", 0, y, CONTENT_WIDTH, 5)
        self.field("Books completed", 0, y, CONTENT_WIDTH, 3)


def register_fonts():
    georgia = Path("/System/Library/Fonts/Supplemental/Georgia.ttf")
    georgia_bold = Path("/System/Library/Fonts/Supplemental/Georgia Bold.ttf")
    if georgia.exists() and georgia_bold.exists():
        pdfmetrics.registerFont(TTFont("RickySerif", str(georgia)))
        pdfmetrics.registerFont(TTFont("RickySerifBold", str(georgia_bold)))
        return "RickySerif", "RickySerifBold"
    return "Times-Roman", "Times-Bold"


SERIF, SERIF_BOLD = register_fonts()


def make_styles():
    base = getSampleStyleSheet()
    return {
        "section": ParagraphStyle(
            "Section",
            parent=base["Heading2"],
            fontName=SERIF_BOLD,
            fontSize=18,
            leading=22,
            textColor=BLACK,
            spaceBefore=8 * mm,
            spaceAfter=4 * mm,
            keepWithNext=True,
            allowWidows=0,
            allowOrphans=0,
        ),
        "subsection": ParagraphStyle(
            "Subsection",
            parent=base["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=9.5,
            leading=13,
            textColor=GOLD,
            spaceBefore=5 * mm,
            spaceAfter=2.5 * mm,
            keepWithNext=True,
            allowWidows=0,
            allowOrphans=0,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=15,
            textColor=INK,
            spaceAfter=3.5 * mm,
            allowWidows=0,
            allowOrphans=0,
        ),
        "prompt": ParagraphStyle(
            "Prompt",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=13,
            textColor=INK,
            spaceBefore=1.5 * mm,
            spaceAfter=1.5 * mm,
            keepWithNext=True,
            allowWidows=0,
            allowOrphans=0,
        ),
        "checkbox": ParagraphStyle(
            "Checkbox",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=INK,
            allowWidows=0,
            allowOrphans=0,
        ),
        "principle": ParagraphStyle(
            "Principle",
            parent=base["BodyText"],
            fontName=SERIF,
            fontSize=12,
            leading=18,
            textColor=BLACK,
            leftIndent=5 * mm,
            borderColor=GOLD,
            borderWidth=0,
            borderPadding=(1 * mm, 0, 1 * mm, 4 * mm),
            spaceBefore=2 * mm,
            spaceAfter=4 * mm,
            allowWidows=0,
            allowOrphans=0,
        ),
        "table": ParagraphStyle(
            "Table",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=7.5,
            leading=10,
            textColor=INK,
            allowWidows=0,
            allowOrphans=0,
        ),
    }


STYLES = make_styles()


def draw_cover(canvas, doc, title, subtitle):
    width, height = A4
    canvas.saveState()
    canvas.setFillColor(BLACK)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setFillColor(GOLD)
    canvas.rect(22 * mm, height - 37 * mm, 26 * mm, 1.2, fill=1, stroke=0)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(22 * mm, height - 31 * mm, "RICKY RECALCATI")
    canvas.setFillColor(CREAM)
    canvas.setFont(SERIF_BOLD, 31)
    title_paragraph = Paragraph(
        escape(title),
        ParagraphStyle(
            "CoverTitle",
            fontName=SERIF_BOLD,
            fontSize=31,
            leading=36,
            textColor=CREAM,
            alignment=TA_LEFT,
        ),
    )
    title_paragraph.wrapOn(canvas, 155 * mm, 75 * mm)
    title_paragraph.drawOn(canvas, 22 * mm, height - 128 * mm)
    canvas.setFillColor(SOFT_GREY)
    subtitle_paragraph = Paragraph(
        escape(subtitle),
        ParagraphStyle(
            "CoverSubtitle",
            fontName="Helvetica",
            fontSize=12,
            leading=19,
            textColor=SOFT_GREY,
        ),
    )
    subtitle_paragraph.wrapOn(canvas, 142 * mm, 45 * mm)
    subtitle_paragraph.drawOn(canvas, 22 * mm, height - 166 * mm)
    canvas.setStrokeColor(colors.Color(0.78, 0.64, 0.28, alpha=0.42))
    canvas.line(22 * mm, 34 * mm, width - 22 * mm, 34 * mm)
    canvas.setFillColor(CREAM)
    canvas.setFont("Helvetica", 8)
    byline = Paragraph(
        "By Ricky Recalcati",
        ParagraphStyle(
            "CoverByline",
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=CREAM,
        ),
    )
    byline.wrapOn(canvas, 142 * mm, 14 * mm)
    byline.drawOn(canvas, 22 * mm, height - 183 * mm)
    resource_label = (
        "PRACTICAL HOSPITALITY RESOURCE"
        if title.startswith("Restaurant") or title.startswith("Manager")
        else "PRACTICAL AI RESOURCE"
        if title.startswith("AI") or title.startswith("ChatGPT")
        else "PERSONAL GROWTH WORKBOOK"
        if title in {"Annual Review Workbook", "Decision Journal", "Reading Tracker"}
        else "PRACTICAL BUSINESS RESOURCE"
    )
    canvas.drawString(22 * mm, 25 * mm, resource_label)
    canvas.setFillColor(GOLD)
    canvas.drawRightString(width - 22 * mm, 25 * mm, "rickyrecalcati.com")
    canvas.restoreState()


def draw_content_page(canvas, doc):
    width, height = A4
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setFillColor(BLACK)
    canvas.rect(0, height - 16 * mm, width, 16 * mm, fill=1, stroke=0)
    canvas.setFillColor(CREAM)
    canvas.setFont("Helvetica-Bold", 7.5)
    canvas.drawString(22 * mm, height - 10.5 * mm, "RICKY RECALCATI")
    canvas.setFillColor(GOLD)
    canvas.drawRightString(width - 22 * mm, height - 10.5 * mm, doc.resource_title.upper())
    canvas.setStrokeColor(RULE)
    canvas.line(22 * mm, 16 * mm, width - 22 * mm, 16 * mm)
    canvas.setFillColor(colors.HexColor("#706A61"))
    canvas.setFont("Helvetica", 7.5)
    canvas.drawString(22 * mm, 10 * mm, "rickyrecalcati.com")
    canvas.drawRightString(width - 22 * mm, 10 * mm, f"{doc.page - 1:02d}")
    canvas.restoreState()


def parse_table(lines, index):
    rows = []
    while index < len(lines) and lines[index].strip().startswith("|"):
        raw_cells = [cell.strip() for cell in lines[index].strip().strip("|").split("|")]
        cells = [
            format_inline(cell)
            for cell in raw_cells
        ]
        is_separator = all(cell and set(cell) <= {"-", ":"} for cell in raw_cells)
        if not is_separator:
            rows.append(cells)
        index += 1
    column_count = len(rows[0]) if rows else 4
    total_width = 166 * mm
    if column_count == 4:
        widths = [58 * mm, 36 * mm, 36 * mm, 36 * mm]
    elif column_count == 5:
        widths = [54 * mm, 30 * mm, 28 * mm, 26 * mm, 28 * mm]
    else:
        widths = [total_width / column_count] * column_count
    table = ResourceTable(rows, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), BLACK),
                ("TEXTCOLOR", (0, 0), (-1, 0), CREAM),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 7.5),
                ("LEADING", (0, 0), (-1, -1), 10),
                ("GRID", (0, 0), (-1, -1), 0.5, RULE),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("ALIGN", (1, 0), (-1, -1), "CENTER"),
                ("TOPPADDING", (0, 0), (-1, -1), 3.2 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3.2 * mm),
                ("LEFTPADDING", (0, 0), (-1, -1), 3 * mm),
                ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm),
            ]
        )
    )
    return table, index


def paragraph(text, style_name):
    return Paragraph(format_inline(text), STYLES[style_name])


def section_heading(text, continued=False):
    label = f"{text} continued" if continued else text
    return Paragraph(escape(label), STYLES["section"])


def continuation_heading(text):
    return Paragraph(escape(f"{text} continued").upper(), STYLES["subsection"])


def flowable_height(flowable, width=CONTENT_WIDTH):
    if hasattr(flowable, "_content"):
        return flowables_height(flowable._content)
    _, height = flowable.wrap(width, CONTENT_HEIGHT)
    return height


def flowables_height(flowables):
    return sum(flowable_height(flowable) for flowable in flowables)


def note_block(label, line_count=2):
    block_class = SignatureBlock if "signature" in label.lower() or "signed off" in label.lower() else NoteBlock
    return block_class(
        [
            Paragraph(escape(label), STYLES["prompt"]),
            WritingLines(count=line_count),
        ]
    )


def line_to_flowables(line, in_principle=False):
    if line.startswith("### "):
        return [Paragraph(escape(line[4:].upper()), STYLES["subsection"])]
    if line.startswith("☐"):
        return [CheckboxItem(line[1:].strip(), STYLES["checkbox"]), Spacer(1, 1.5 * mm)]
    if line.endswith("□"):
        return [CheckboxItem(line[:-1].strip(), STYLES["checkbox"]), Spacer(1, 1.5 * mm)]
    if line in {"-", "1.", "2.", "3."}:
        prefix = "" if line == "-" else f"{line} "
        return [
            NoteBlock(
                [
                    Paragraph(escape(prefix), STYLES["prompt"]),
                    WritingLines(count=1),
                ]
            ),
            Spacer(1, 1.5 * mm),
        ]
    if line.startswith("- "):
        return [CheckboxItem(line[2:], STYLES["checkbox"])]
    if line in WORKBOOK_LONG_RESPONSE_LABELS:
        return [note_block(line, 5), Spacer(1, 2 * mm)]
    if line in WORKBOOK_COMPACT_FIELD_LABELS:
        return [note_block(line, 1), Spacer(1, 1.5 * mm)]
    if line in WORKBOOK_FIELD_LABELS:
        return [note_block(line, 2), Spacer(1, 1.5 * mm)]
    if line in DECISION_JOURNAL_LONG_FIELD_LABELS:
        return [note_block(line, 4), Spacer(1, 2 * mm)]
    if line in DECISION_JOURNAL_FIELD_LABELS:
        line_count = 1 if line in {"Confidence", "Evidence Quality", "Emotional Control", "Time Available", "Understanding of Risks"} else 2
        return [note_block(line, line_count), Spacer(1, 1.5 * mm)]
    if line.endswith(":") or line.endswith("?"):
        line_count = 1 if line == "Score:" else 2
        return [note_block(line, line_count), Spacer(1, 1.5 * mm)]

    style = "principle" if in_principle else "body"
    return [paragraph(line, style)]


def chunk_large_section(heading, body_flowables):
    chunks = []
    current = [section_heading(heading)]
    current_height = flowables_height(current)

    for flowable in body_flowables:
        height = flowable_height(flowable)
        if (
            len(current) > 1
            and current_height + height > CONTINUATION_CHUNK_LIMIT
        ):
            chunks.append(current)
            current = [continuation_heading(heading), flowable]
            current_height = flowables_height(current)
        else:
            current.append(flowable)
            current_height += height

    if current:
        chunks.append(current)

    story = []
    for chunk in chunks:
        story.extend([CondPageBreak(min(flowables_height(chunk), SECTION_START_MINIMUM)), SectionBlock(chunk)])
    return story


def section_to_story(heading, body_flowables):
    if heading in DECISION_JOURNAL_EMPTY_SECTION_FIELDS and not body_flowables:
        body_flowables = [WritingLines(count=6), Spacer(1, 2 * mm)]

    section = [section_heading(heading), *body_flowables]
    section_height = flowables_height(section)
    story = []

    if heading in FORCED_PAGE_BREAK_BEFORE:
        story.append(PageBreak())

    if section_height <= MAJOR_SECTION_LIMIT:
        story.extend([CondPageBreak(section_height), SectionBlock(section)])
        return story

    story.append(CondPageBreak(SECTION_START_MINIMUM))
    story.extend(chunk_large_section(heading, body_flowables))
    return story


def format_inline(text):
    escaped = escape(text)

    def replace_link(match):
        label = escape(match.group(1))
        url = escape(match.group(2), {'"': "&quot;"})
        return f'<a href="{url}" color="#8A6F22"><u>{label}</u></a>'

    return re.sub(r"\[([^\]]+)\]\(([^)]+)\)", replace_link, escaped)


def markdown_to_story(markdown):
    lines = markdown.splitlines()
    title = lines[0].removeprefix("# ").strip()
    subtitle = next(line.strip() for line in lines[1:] if line.strip())
    start = next(index for index, line in enumerate(lines) if line.startswith("## "))
    story = [PageBreak()]
    index = start
    current_heading = None
    current_flowables = []
    in_principle = False

    def flush_section():
        nonlocal current_heading, current_flowables
        if current_heading is not None:
            story.extend(section_to_story(current_heading, current_flowables))
        current_heading = None
        current_flowables = []

    while index < len(lines):
        line = lines[index].strip()
        if not line:
            index += 1
            continue
        if line.startswith("## "):
            flush_section()
            current_heading = line[3:]
            in_principle = "principle" in current_heading.lower()
        elif line.startswith("|"):
            table, index = parse_table(lines, index)
            current_flowables.extend([Spacer(1, 2 * mm), table, Spacer(1, 4 * mm)])
            continue
        else:
            current_flowables.extend(line_to_flowables(line, in_principle))
        index += 1

    flush_section()
    return title, subtitle, story


def bullet(text):
    return paragraph(f"• {text}", "body")


def story_page(*flowables):
    return [PageBreak(), SectionBlock(list(flowables))]


def decision_journal_story(markdown):
    lines = markdown.splitlines()
    title = lines[0].removeprefix("# ").strip()
    subtitle = next(line.strip() for line in lines[1:] if line.strip())

    story = []
    story.extend(
        story_page(
            section_heading("Introduction"),
            paragraph("Every decision teaches you something.", "body"),
            paragraph(
                "The problem is that most people only remember the outcome—not what they were thinking when they made it.",
                "body",
            ),
            paragraph(
                "A Decision Journal helps separate good decisions from lucky outcomes and bad outcomes from bad thinking.",
                "body",
            ),
            paragraph("Over time you’ll begin to notice patterns:", "body"),
            bullet("recurring mistakes"),
            bullet("emotional decisions"),
            bullet("hidden biases"),
            bullet("better judgement"),
            paragraph(
                "Professional investors, CEOs and elite performers have used decision journals for decades.",
                "body",
            ),
            paragraph(
                "This workbook gives you a practical system you can return to again and again.",
                "body",
            ),
            section_heading("How To Use This Journal"),
            paragraph("Complete a new entry before making any meaningful decision.", "body"),
            paragraph("Examples include:", "body"),
            bullet("accepting a new job"),
            bullet("investing money"),
            bullet("hiring someone"),
            bullet("changing careers"),
            bullet("buying a house"),
            bullet("starting a business"),
            bullet("making an important personal decision"),
            paragraph(
                "Once the outcome becomes clear, return to the journal and complete the review.",
                "body",
            ),
            paragraph("Your goal isn’t perfection.", "body"),
            paragraph("Your goal is improving your thinking.", "body"),
        )
    )

    story.extend(
        story_page(
            section_heading("The Decision Framework"),
            paragraph("Before every important decision ask yourself:", "body"),
            *[
                note_block(question, 1)
                for question in [
                    "1. What decision am I making?",
                    "2. Why does it matter?",
                    "3. What outcome do I want?",
                    "4. What assumptions am I making?",
                    "5. What evidence supports them?",
                    "6. What evidence challenges them?",
                    "7. What would make me change my mind?",
                ]
            ],
        )
    )

    story.extend(
        story_page(
            section_heading("Common Thinking Traps"),
            paragraph("Watch for these biases:", "body"),
            *[
                CheckboxItem(item, STYLES["checkbox"])
                for item in [
                    "Confirmation bias",
                    "Overconfidence",
                    "Fear of missing out",
                    "Sunk cost fallacy",
                    "Recency bias",
                    "Anchoring",
                    "Groupthink",
                    "Emotional decision-making",
                ]
            ],
            note_block("Reflection:", 1),
            note_block("Which of these affects you most often?", 3),
        )
    )

    story.extend(
        story_page(
            section_heading("Decision Scorecard"),
            paragraph("Rate yourself before deciding.", "body"),
            *[
                note_block(label, 1)
                for label in [
                    "Confidence",
                    "Evidence Quality",
                    "Emotional Control",
                    "Time Available",
                    "Understanding of Risks",
                    "Confidence",
                ]
            ],
            section_heading("Decision Template"),
            note_block("Decision Number _______", 1),
            note_block("Date", 1),
            note_block("The Decision", 5),
        )
    )

    story.extend(
        story_page(
            section_heading("Why This Matters"),
            note_block("Why This Matters", 6),
            section_heading("My Desired Outcome"),
            note_block("My Desired Outcome", 7),
        )
    )

    story.extend(
        story_page(
            section_heading("Options Considered"),
            note_block("Option 1", 1),
            note_block("Pros", 1),
            note_block("Cons", 1),
            note_block("Option 2", 1),
            note_block("Pros", 1),
            note_block("Cons", 1),
            note_block("Option 3", 1),
            note_block("Pros", 1),
            note_block("Cons", 1),
            note_block("Which option am I choosing?", 2),
            note_block("Why?", 2),
        )
    )

    story.extend(
        story_page(
            section_heading("Risks"),
            note_block("What could go wrong?", 3),
            paragraph("How likely are these?", "body"),
            CheckboxItem("Low", STYLES["checkbox"]),
            CheckboxItem("Medium", STYLES["checkbox"]),
            CheckboxItem("High", STYLES["checkbox"]),
            note_block("How could I reduce these risks?", 3),
            section_heading("Assumptions"),
            note_block("I’m assuming that…", 3),
            paragraph("How certain am I?", "body"),
            CheckboxItem("Low", STYLES["checkbox"]),
            CheckboxItem("Medium", STYLES["checkbox"]),
            CheckboxItem("High", STYLES["checkbox"]),
        )
    )

    story.extend(
        story_page(
            section_heading("Worst-Case Scenario"),
            note_block("If everything went wrong…", 2),
            note_block("What would happen?", 3),
            note_block("How would I recover?", 3),
            paragraph("Would I survive it?", "body"),
            CheckboxItem("Yes", STYLES["checkbox"]),
            CheckboxItem("No", STYLES["checkbox"]),
            section_heading("Confidence Check"),
            paragraph("Complete the sentences.", "body"),
            note_block("The strongest reason this decision succeeds is…", 3),
            note_block("The strongest reason it fails is…", 3),
        )
    )

    story.extend(
        story_page(
            section_heading("Future Review"),
            paragraph("Review this decision after:", "body"),
            CheckboxItem("1 Month", STYLES["checkbox"]),
            CheckboxItem("3 Months", STYLES["checkbox"]),
            CheckboxItem("6 Months", STYLES["checkbox"]),
            CheckboxItem("12 Months", STYLES["checkbox"]),
            section_heading("Outcome Review"),
            note_block("Date Reviewed", 1),
            note_block("What happened?", 4),
            paragraph("Did the outcome match my expectations?", "body"),
            CheckboxItem("Yes", STYLES["checkbox"]),
            CheckboxItem("Partly", STYLES["checkbox"]),
            CheckboxItem("No", STYLES["checkbox"]),
        )
    )

    story.extend(
        story_page(
            section_heading("Lessons Learned"),
            note_block("What did I get right?", 3),
            note_block("What did I miss?", 3),
            note_block("What would I do differently?", 3),
            section_heading("Decision Rating"),
            paragraph("Rate this decision.", "body"),
            *[
                paragraph(f"{label}     ★★★★★", "body")
                for label in ["Preparation", "Logic", "Execution", "Outcome", "Overall"]
            ],
        )
    )

    story.extend(
        story_page(
            section_heading("Blank Decision Templates"),
            paragraph(
                "The remainder of the workbook should contain six identical full-page decision templates using the same structure:",
                "body",
            ),
            bullet("Decision"),
            bullet("Context"),
            bullet("Options"),
            bullet("Risks"),
            bullet("Assumptions"),
            bullet("Final Choice"),
            bullet("Confidence Rating"),
            bullet("Future Review"),
            bullet("Lessons Learned"),
            paragraph(
                "Each template should start on a new page and leave generous writing space.",
                "body",
            ),
        )
    )

    return title, subtitle, story


def reading_review_pages(index):
    return [
        PageBreak(),
        BookReviewTemplatePage(index, 1),
        PageBreak(),
        BookReviewTemplatePage(index, 2),
    ]


def reading_tracker_story(markdown):
    lines = markdown.splitlines()
    title = lines[0].removeprefix("# ").strip()
    subtitle = next(line.strip() for line in lines[1:] if line.strip())

    story = []
    story.extend(
        story_page(
            section_heading("Welcome"),
            paragraph("Reading books is easy.", "body"),
            paragraph("Applying what you learn is much harder.", "body"),
            paragraph(
                "Most people remember the title of a book but forget the ideas that made it valuable.",
                "body",
            ),
            paragraph(
                "This Reading Tracker helps you slow down, think more deeply and turn good ideas into lasting habits.",
                "body",
            ),
            paragraph("Its purpose isn’t to help you read more books.", "body"),
            paragraph(
                "Its purpose is to help you get more value from every book you read.",
                "body",
            ),
            section_heading("How To Use This Tracker"),
            paragraph("Use this journal throughout the year.", "body"),
            paragraph("Before reading:", "body"),
            bullet("Record why you chose the book."),
            bullet("Write down what you hope to learn."),
            paragraph("While reading:", "body"),
            bullet("Capture ideas worth remembering."),
            bullet("Highlight concepts that challenge your thinking."),
            bullet("Mark practical actions."),
            paragraph("After reading:", "body"),
            bullet("Summarise the book."),
            bullet("Decide what you’ll implement."),
            bullet("Record whether you would recommend it."),
            paragraph("Remember:", "body"),
            paragraph("Reading changes nothing. Applying what you read changes everything.", "body"),
        )
    )

    story.extend([PageBreak(), ReadingGoalsPage()])

    for index in range(1, 4):
        story.extend(reading_review_pages(index))

    story.extend(
        story_page(
            section_heading("Monthly Reading Review"),
            note_block("Month:", 1),
            note_block("Books completed:", 1),
            note_block("Best book:", 1),
            note_block("Biggest lesson learned:", 3),
            note_block("One idea I actually applied:", 3),
            note_block("What can I improve next month?", 3),
        )
    )

    story.extend(
        story_page(
            section_heading("Quarterly Reading Review"),
            paragraph("Quarter", "body"),
            CheckboxItem("Q1", STYLES["checkbox"]),
            CheckboxItem("Q2", STYLES["checkbox"]),
            CheckboxItem("Q3", STYLES["checkbox"]),
            CheckboxItem("Q4", STYLES["checkbox"]),
            note_block("Books completed:", 1),
            note_block("Favourite book:", 1),
            note_block("Three ideas worth remembering:", 4),
            note_block("One habit I developed because of reading:", 3),
        )
    )

    story.extend(
        story_page(
            section_heading("Annual Reading Review"),
            note_block("Books completed", 1),
            note_block("Favourite book of the year", 1),
            note_block("Most useful book", 1),
            note_block("Most enjoyable book", 1),
            note_block("Book that changed my thinking the most", 1),
            note_block("The five biggest lessons from this year:", 6),
        )
    )

    story.extend(
        story_page(
            section_heading("Reading Next Year"),
            note_block("Books I want to prioritise:", 6),
            note_block("One reading habit I’ll improve:", 3),
            section_heading("Final Reflection"),
            paragraph("Complete these sentences.", "body"),
            note_block("The best idea I discovered this year was…", 2),
            note_block("The book I’m most grateful I read was…", 2),
            note_block("Next year I want reading to help me become…", 2),
        )
    )

    story.extend(
        story_page(
            section_heading("Continue Exploring"),
            paragraph(
                "If you enjoyed this resource, explore more free guides, practical articles and book series at:",
                "body",
            ),
            paragraph("[rickyrecalcati.com](https://www.rickyrecalcati.com)", "body"),
            paragraph("Also recommended:", "body"),
            paragraph("[The Second Act series](https://www.rickyrecalcati.com/books/the-second-act)", "body"),
            paragraph("[No Robots Required series](https://www.rickyrecalcati.com/books/no-robots-required)", "body"),
            paragraph("[Scaling Hospitality series](https://www.rickyrecalcati.com/books/scaling-hospitality)", "body"),
            paragraph("[Better Decisions Compound Quietly](https://www.rickyrecalcati.com/articles/better-decisions-compound-quietly)", "body"),
            paragraph("[Your Life Is the Sum of Small Decisions](https://www.rickyrecalcati.com/articles/your-life-is-the-sum-of-small-decisions)", "body"),
        )
    )

    return title, subtitle, story


def blank_decision_template(index):
    return [PageBreak(), BlankDecisionTemplate(index)]


def generate_resource(slug, expected_title):
    source = RESOURCE_DIR / f"{slug}.md"
    output = RESOURCE_DIR / f"{slug}.pdf"
    markdown = source.read_text(encoding="utf-8")
    if slug == "decision-journal":
        title, subtitle, story = decision_journal_story(markdown)
    elif slug == "reading-tracker":
        title, subtitle, story = reading_tracker_story(markdown)
    else:
        title, subtitle, story = markdown_to_story(markdown)
    if title != expected_title:
        raise ValueError(f"Unexpected title in {source}: {title}")

    if slug == "decision-journal":
        for index in range(1, 7):
            story.extend(blank_decision_template(index))

    doc = SimpleDocTemplate(
        str(output),
        pagesize=A4,
        rightMargin=22 * mm,
        leftMargin=22 * mm,
        topMargin=25 * mm,
        bottomMargin=22 * mm,
        title=title,
        author="Ricky Recalcati",
        subject=subtitle,
    )
    doc.resource_title = title
    doc.build(
        story,
        onFirstPage=lambda canvas, current_doc: draw_cover(
            canvas, current_doc, title, subtitle
        ),
        onLaterPages=draw_content_page,
    )
    print(f"Generated {output.relative_to(ROOT)}")


def main():
    for slug, title in RESOURCES:
        generate_resource(slug, title)


if __name__ == "__main__":
    main()

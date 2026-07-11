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
)


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
    resource_label = (
        "PRACTICAL HOSPITALITY RESOURCE"
        if title.startswith("Restaurant") or title.startswith("Manager")
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


def generate_resource(slug, expected_title):
    source = RESOURCE_DIR / f"{slug}.md"
    output = RESOURCE_DIR / f"{slug}.pdf"
    title, subtitle, story = markdown_to_story(source.read_text(encoding="utf-8"))
    if title != expected_title:
        raise ValueError(f"Unexpected title in {source}: {title}")

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

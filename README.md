An Interactive Form Validator using HTML, CSS and JavaScript

Objectives -
  
  1. Real-time Validation:
        Username validation (length, allowed characters)
        Email format validation
        Password strength checking
        Password confirmation matching
  
  2. Visual Feedback:
        Success/error states with color indicators
        Password strength meter
        Clear error messages
        Success messages when appropriate
  
  3. User Experience Features:
        Debounced validation (reduces unnecessary validation calls)
        Disabled submit button until all fields are valid
        Smooth transitions and animations
        Mobile-responsive design

CSV Validations - 

1. Allowed Columns (Field Names)
  Your CSV should only contain specific fields. Some key columns you can include are:
    page_label – A label or title for the page.
    placement – Defines the placement of an element on a page.
    tooltip – Tooltip text for additional information.
    link_type – Type of link (e.g., external, internal).
    icon_style – Defines the style of an icon.
    x, y, h, w – Coordinates and dimensions for placement.
    base_path, url, page – Paths and URLs for linking content.
    audio_1, audio_2, audio_3, audio_4 – Audio files linked to the content.
    readalong_group – Grouping for read-along elements.
    animation-color – Color settings for animations.
    video_1 – Video file reference.
    subtitle_1, subtitle_2, subtitle_3, subtitle_4 – Subtitles for multimedia content.
    html_ele_ref – Reference to HTML elements.
    view_mode – Display mode or settings.
2. Required Columns
  Ensure that mandatory fields such as page_label, placement, link_type, base_path, url, audio_1, icon_type, icon_style, page are always included.
3. Column Sequence
  Maintaining the correct order of columns improves readability and ensures smooth validation.
4. Base URLs
  Your file should include URLs that are part of the allowed domains, such as VHL_CENTRAL_M3A, VHL_CENTRAL_ASSETS.
5. Valid Worksheet Structure
  The CSV file should be structured properly, meaning:
    No empty rows at the start or between valid data.
    Each row should match the expected column format.

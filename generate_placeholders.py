
import os
from PIL import Image, ImageDraw

def create_placeholder_spritesheet(name, color, output_path):
    # standard frame size (High Quality for iPad)
    frame_width = 200
    frame_height = 400
    
    # States: Idle (6), Walk (6), Jump (1), Crouch (1), Attack (3), Hit (1), Block (1), Intro (4), Victory (4), Crumple (2), Die (3)
    # Total frames: 32 (8 columns x 4 rows)
    columns = 8
    rows = 4
    total_frames = 32
    sheet_width = frame_width * columns
    sheet_height = frame_height * rows
    
    sheet = Image.new('RGBA', (sheet_width, sheet_height))
    draw = ImageDraw.Draw(sheet)
    
    actions = [
        ('idle', 6), ('walk', 6), ('jump', 1), ('crouch', 1),
        ('attack', 3), ('hit', 1), ('block', 1), 
        ('intro', 4), ('victory', 4), ('crumple', 2), ('die', 3)
    ]
    
    frame_index = 0
    
    for action, count in actions:
        for i in range(count):
            col = frame_index % columns
            row = frame_index // columns
            
            current_x = col * frame_width
            current_y = row * frame_height
            
            # Draw fighter body (Scaled for 200x400)
            body_color = color
            if action == 'hit': body_color = 'red'
            if action == 'block': body_color = 'blue'
            if action == 'die': body_color = 'black'
            
            # Scaled coordinates
            draw.rectangle([current_x + 40, current_y + 100, current_x + 160, current_y + 360], fill=body_color)
            
            # Draw head (Scaled)
            draw.ellipse([current_x + 60, current_y + 20, current_x + 140, current_y + 100], fill='peachpuff')
            
            # Draw text (Scaled position)
            draw.text((current_x + 20, current_y + 360), f"{name}\n{action}\n{i+1}", fill="white")
            
            frame_index += 1
            
    sheet.save(output_path)
    # print(f"Created {output_path}")

roster = [
    ('ann', 'pink'),
    ('mom', 'purple'),
    ('dad', 'blue'),
    ('brother', 'green'),
    ('witch', 'gray'),
    ('fat', 'orange'),
    ('fresway_worker', 'yellow')
]

for name, color in roster:
    path = f'public/assets/fighters/{name}/{name}.png'
    os.makedirs(os.path.dirname(path), exist_ok=True)
    create_placeholder_spritesheet(name.capitalize(), color, path)


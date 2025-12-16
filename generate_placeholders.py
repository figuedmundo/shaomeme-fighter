
import os
from PIL import Image, ImageDraw

def create_placeholder_spritesheet(name, color, output_path):
    # standard frame size
    frame_width = 100
    frame_height = 200
    
    # States: Idle (4), Walk (6), Jump (1), Crouch (1), Attack (3), Hit (1), Block (1), Die (1)
    # Total frames: 18
    
    total_frames = 18
    sheet_width = frame_width * total_frames
    sheet_height = frame_height
    
    sheet = Image.new('RGBA', (sheet_width, sheet_height))
    draw = ImageDraw.Draw(sheet)
    
    actions = [
        ('idle', 4), ('walk', 6), ('jump', 1), ('crouch', 1),
        ('attack', 3), ('hit', 1), ('block', 1), ('die', 1)
    ]
    
    current_x = 0
    
    for action, count in actions:
        for i in range(count):
            # Draw frame border
            # draw.rectangle([current_x, 0, current_x + frame_width - 1, frame_height - 1], outline="white")
            
            # Draw fighter body
            body_color = color
            if action == 'hit': body_color = 'red'
            if action == 'block': body_color = 'blue'
            if action == 'die': body_color = 'black'
            
            draw.rectangle([current_x + 20, 50, current_x + 80, 180], fill=body_color)
            
            # Draw head
            draw.ellipse([current_x + 30, 10, current_x + 70, 50], fill='peachpuff')
            
            # Draw text
            draw.text((current_x + 10, 180), f"{name}\n{action}\n{i+1}", fill="white")
            
            current_x += frame_width
            
    sheet.save(output_path)
    print(f"Created {output_path}")

create_placeholder_spritesheet('Ryu', 'white', 'assets/fighters/ryu/ryu.png')
create_placeholder_spritesheet('Ken', 'red', 'assets/fighters/ken/ken.png')

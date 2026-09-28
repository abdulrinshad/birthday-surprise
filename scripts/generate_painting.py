import os
import json
import numpy as np
from PIL import Image, ImageFilter, ImageOps, ImageEnhance

SRC_PATH = "src/assets/mystery/eshal.jpeg"
OUT_DIR = "src/assets/mystery"
DATA_OUT = "src/data/paintingRegions.js"

img = Image.open(SRC_PATH).convert("RGB")
w, h = img.size
print(f"Loaded image: {w}x{h}")

# 1. Create a digital oil painting version of eshal.jpeg
# Edge-preserving painterly filter:
# Multi-pass median filter to produce smooth painterly impasto strokes + unsharp mask
smoothed = img.filter(ImageFilter.MedianFilter(size=5))
smoothed = smoothed.filter(ImageFilter.MedianFilter(size=3))

# Subtle contrast and warmth enhancement for fine-art painting look
enhancer = ImageEnhance.Color(smoothed)
painterly = enhancer.enhance(1.15)
contrast_enhancer = ImageEnhance.Contrast(painterly)
painterly = contrast_enhancer.enhance(1.08)

# Add subtle fine-art canvas texture overlay
canvas_tex = np.zeros((h, w, 3), dtype=np.float32)
# Procedural subtle linen weave
y_indices, x_indices = np.indices((h, w))
weave = np.sin(x_indices * 0.8) * np.cos(y_indices * 0.8) * 4.0
paint_arr = np.array(painterly, dtype=np.float32)
paint_arr = np.clip(paint_arr + weave[:, :, None], 0, 255).astype(np.uint8)
final_painting = Image.fromarray(paint_arr)

# Save the digital painting artwork
final_painting.save(os.path.join(OUT_DIR, "painting_target.webp"), "WEBP", quality=92)
print("Saved painting_target.webp")

# 2. Generate mystery underdrawing (charcoal sketch on warm canvas)
# Edge detection from the photo contours
gray = img.convert("L")
edges = gray.filter(ImageFilter.FIND_EDGES)
edges = edges.filter(ImageFilter.MaxFilter(size=3))
edges_arr = np.array(edges)

# Create warm parchment underdrawing
sketch_arr = np.zeros((h, w, 3), dtype=np.uint8)
sketch_arr[:, :] = [22, 14, 24] # Deep warm charcoal background

# Add faint outlines
edge_mask = edges_arr > 25
sketch_arr[edge_mask] = [212, 139, 159] # Faint rose-gold contour lines
sketch_img = Image.fromarray(sketch_arr)
sketch_img = sketch_img.filter(ImageFilter.GaussianBlur(radius=0.7))
sketch_img.save(os.path.join(OUT_DIR, "sketch_underdrawing.webp"), "WEBP", quality=85)
print("Saved sketch_underdrawing.webp")

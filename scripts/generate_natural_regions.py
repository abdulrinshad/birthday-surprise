import os
import json
import math
import numpy as np
from PIL import Image

# Load source image to sample exact real colors
IMG_PATH = "src/assets/mystery/eshal.jpeg"
img = Image.open(IMG_PATH).convert("RGB")
img_arr = np.array(img)
H, W, _ = img_arr.shape # 1280, 887

print(f"Sampling from image {W}x{H}...")

def sample_color(points):
    """Compute average color inside bounding box / polygon of points"""
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    min_x, max_x = max(0, int(min(xs))), min(W - 1, int(max(xs)))
    min_y, max_y = max(0, int(min(ys))), min(H - 1, int(max(ys)))
    
    # Simple sampling at center & quarter points
    cx = int(sum(xs) / len(xs))
    cy = int(sum(ys) / len(ys))
    cx = max(0, min(W - 1, cx))
    cy = max(0, min(H - 1, cy))
    
    crop = img_arr[min_y:max_y+1, min_x:max_x+1]
    if crop.size > 0:
        rgb = np.mean(crop, axis=(0, 1)).astype(int)
    else:
        rgb = img_arr[cy, cx]
    return f"#{rgb[0]:02X}{rgb[1]:02X}{rgb[2]:02X}"

def smooth_curve(pts, steps=4):
    """Generate smooth intermediate points between control points"""
    res = []
    n = len(pts)
    for i in range(n):
        p0 = pts[(i - 1) % n]
        p1 = pts[i]
        p2 = pts[(i + 1) % n]
        p3 = pts[(i + 2) % n]
        for t in np.linspace(0, 1, steps, endpoint=False):
            # Catmull-Rom spline interpolation
            t2 = t * t
            t3 = t2 * t
            x = 0.5 * ((2 * p1[0]) +
                       (-p0[0] + p2[0]) * t +
                       (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
                       (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)
            y = 0.5 * ((2 * p1[1]) +
                       (-p0[1] + p2[1]) * t +
                       (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
                       (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
            res.append([round(float(x), 1), round(float(y), 1)])
    return res

# Construct rich, detailed natural regions
raw_regions = []

# --- 1. SKY & OVERCAST CLOUDS ---
raw_regions.append({
    "id": "sky_cirrus_nw", "name": "Northwest Cirrus Cloud", "category": "Atmosphere",
    "pts": [[0, 0], [220, 0], [250, 60], [180, 80], [90, 70], [0, 85]]
})
raw_regions.append({
    "id": "sky_cirrus_n", "name": "Upper Cloud Crest", "category": "Atmosphere",
    "pts": [[220, 0], [450, 0], [440, 75], [320, 90], [250, 60]]
})
raw_regions.append({
    "id": "sky_cirrus_ne", "name": "Northeast Cloud Bank", "category": "Atmosphere",
    "pts": [[450, 0], [680, 0], [660, 70], [540, 85], [440, 75]]
})
raw_regions.append({
    "id": "sky_cirrus_e", "name": "East Horizon Nimbus", "category": "Atmosphere",
    "pts": [[680, 0], [887, 0], [887, 90], [790, 85], [660, 70]]
})
raw_regions.append({
    "id": "sky_overcast_w", "name": "Overcast Western Sky", "category": "Atmosphere",
    "pts": [[0, 85], [90, 70], [180, 80], [260, 140], [180, 160], [0, 175]]
})
raw_regions.append({
    "id": "sky_overcast_c1", "name": "Upper Central Cumulus", "category": "Atmosphere",
    "pts": [[180, 80], [320, 90], [440, 75], [420, 155], [290, 165], [260, 140]]
})
raw_regions.append({
    "id": "sky_overcast_c2", "name": "Central Atmospheric Drift", "category": "Atmosphere",
    "pts": [[440, 75], [540, 85], [660, 70], [620, 150], [510, 160], [420, 155]]
})
raw_regions.append({
    "id": "sky_overcast_e", "name": "Overcast Eastern Flank", "category": "Atmosphere",
    "pts": [[660, 70], [790, 85], [887, 90], [887, 180], [760, 170], [620, 150]]
})
raw_regions.append({
    "id": "sky_haze_w", "name": "Western Horizon Haze", "category": "Atmosphere",
    "pts": [[0, 175], [180, 160], [260, 140], [290, 165], [250, 240], [140, 245], [0, 260]]
})
raw_regions.append({
    "id": "sky_haze_c", "name": "Mid-Sky Silver Haze", "category": "Atmosphere",
    "pts": [[290, 165], [420, 155], [510, 160], [620, 150], [590, 235], [470, 240], [360, 245], [250, 240]]
})
raw_regions.append({
    "id": "sky_haze_e", "name": "Eastern Horizon Haze", "category": "Atmosphere",
    "pts": [[620, 150], [760, 170], [887, 180], [887, 265], [770, 255], [660, 250], [590, 235]]
})
raw_regions.append({
    "id": "sky_mist_treeline_w", "name": "Canopy Mist (West)", "category": "Atmosphere",
    "pts": [[0, 260], [140, 245], [250, 240], [240, 310], [120, 315], [0, 325]]
})
raw_regions.append({
    "id": "sky_mist_treeline_c", "name": "Canopy Mist (Center)", "category": "Atmosphere",
    "pts": [[250, 240], [360, 245], [470, 240], [590, 235], [570, 290], [440, 295], [330, 305], [240, 310]]
})
raw_regions.append({
    "id": "sky_mist_treeline_e", "name": "Canopy Mist (East)", "category": "Atmosphere",
    "pts": [[590, 235], [660, 250], [770, 255], [887, 265], [887, 320], [780, 310], [670, 305], [570, 290]]
})

# --- 2. DISTANT TREES & FOLIAGE ---
raw_regions.append({
    "id": "tree_w_shadow", "name": "West Forest Shadow Depth", "category": "Nature",
    "pts": [[0, 325], [120, 315], [190, 335], [180, 385], [100, 395], [0, 400]]
})
raw_regions.append({
    "id": "tree_w_mid_canopy", "name": "West Oak Canopy", "category": "Nature",
    "pts": [[120, 315], [240, 310], [280, 330], [270, 380], [190, 335]]
})
raw_regions.append({
    "id": "tree_w_highlight", "name": "West Sunlit Leaves", "category": "Nature",
    "pts": [[180, 305], [250, 295], [290, 325], [260, 350], [200, 340]]
})
raw_regions.append({
    "id": "tree_c_left_grove", "name": "Central Grove (West Flank)", "category": "Nature",
    "pts": [[280, 330], [360, 315], [370, 375], [300, 385], [270, 380]]
})
raw_regions.append({
    "id": "tree_c_deep_shadow", "name": "Grove Core Shadow", "category": "Nature",
    "pts": [[360, 315], [440, 295], [450, 355], [370, 375]]
})
raw_regions.append({
    "id": "tree_c_canopy_top", "name": "Grove Upper Crest", "category": "Nature",
    "pts": [[330, 305], [440, 295], [510, 300], [490, 345], [420, 345], [360, 315]]
})
raw_regions.append({
    "id": "tree_c_right_grove", "name": "Central Grove (East Flank)", "category": "Nature",
    "pts": [[510, 300], [570, 290], [610, 340], [530, 365], [490, 345]]
})
raw_regions.append({
    "id": "tree_e_canopy_crest", "name": "East Park Foliage Crest", "category": "Nature",
    "pts": [[570, 290], [670, 305], [720, 320], [690, 355], [610, 340]]
})
raw_regions.append({
    "id": "tree_e_sunlit_canopy", "name": "East Foliage Sunlit Highlight", "category": "Nature",
    "pts": [[670, 305], [780, 310], [820, 335], [770, 360], [720, 320]]
})
raw_regions.append({
    "id": "tree_e_deep_forest", "name": "East Woods Deep Shadow", "category": "Nature",
    "pts": [[780, 310], [887, 320], [887, 375], [820, 370], [820, 335]]
})
raw_regions.append({
    "id": "tree_e_lower_mass", "name": "East Woods Lower Branches", "category": "Nature",
    "pts": [[690, 355], [770, 360], [820, 370], [887, 375], [887, 405], [810, 400], [710, 395]]
})

# --- 3. MEMORIAL COLONNADE & PILLARS ---
raw_regions.append({
    "id": "monument_architrave_w", "name": "Memorial Entablature (West)", "category": "Stone",
    "pts": [[560, 355], [680, 355], [680, 372], [560, 372]]
})
raw_regions.append({
    "id": "monument_architrave_e", "name": "Memorial Entablature (East)", "category": "Stone",
    "pts": [[680, 355], [850, 355], [850, 372], [680, 372]]
})
raw_regions.append({
    "id": "pillar_1", "name": "Memorial Column 1 (West)", "category": "Stone",
    "pts": [[565, 372], [590, 372], [590, 415], [565, 415]]
})
raw_regions.append({
    "id": "pillar_2", "name": "Memorial Column 2", "category": "Stone",
    "pts": [[610, 372], [635, 372], [635, 415], [610, 415]]
})
raw_regions.append({
    "id": "pillar_3", "name": "Memorial Column 3", "category": "Stone",
    "pts": [[655, 372], [680, 372], [680, 415], [655, 415]]
})
raw_regions.append({
    "id": "pillar_4", "name": "Memorial Column 4", "category": "Stone",
    "pts": [[700, 372], [725, 372], [725, 415], [700, 415]]
})
raw_regions.append({
    "id": "pillar_5", "name": "Memorial Column 5", "category": "Stone",
    "pts": [[745, 372], [770, 372], [770, 415], [745, 415]]
})
raw_regions.append({
    "id": "pillar_6", "name": "Memorial Column 6 (East)", "category": "Stone",
    "pts": [[790, 372], [815, 372], [815, 415], [790, 415]]
})
raw_regions.append({
    "id": "colonnade_shadows", "name": "Inter-Pillar Shadow Voids", "category": "Stone",
    "pts": [[590, 372], [610, 372], [610, 415], [590, 415]]
})
raw_regions.append({
    "id": "colonnade_plinth", "name": "Colonnade Stone Stylobate", "category": "Stone",
    "pts": [[560, 415], [850, 415], [850, 428], [560, 428]]
})

# --- 4. FOUNTAIN JETS & WATER SPRAY ---
raw_regions.append({
    "id": "fountain_spray_arc_w1", "name": "West Fountain Arc (Outer)", "category": "Water",
    "pts": [[0, 400], [100, 395], [190, 410], [170, 440], [80, 435], [0, 440]]
})
raw_regions.append({
    "id": "fountain_spray_arc_w2", "name": "West Fountain Arc (Inner High)", "category": "Water",
    "pts": [[100, 395], [210, 405], [290, 415], [280, 450], [190, 440], [170, 440]]
})
raw_regions.append({
    "id": "fountain_spray_arc_w3", "name": "West Fountain Arc (Crest Jets)", "category": "Water",
    "pts": [[210, 405], [330, 418], [340, 458], [280, 450]]
})
raw_regions.append({
    "id": "fountain_mist_cloud_w", "name": "West Fountain Water Mist", "category": "Water",
    "pts": [[0, 440], [80, 435], [190, 440], [280, 450], [260, 475], [130, 470], [0, 475]]
})
raw_regions.append({
    "id": "fountain_pool_water_w", "name": "Reflective Basin Pool (West)", "category": "Water",
    "pts": [[0, 475], [130, 470], [260, 475], [340, 475], [320, 500], [150, 505], [0, 500]]
})
raw_regions.append({
    "id": "fountain_spray_arc_e1", "name": "East Fountain Arc (Inner)", "category": "Water",
    "pts": [[545, 425], [630, 415], [710, 420], [690, 455], [610, 455], [545, 450]]
})
raw_regions.append({
    "id": "fountain_spray_arc_e2", "name": "East Fountain Arc (Mid Arc)", "category": "Water",
    "pts": [[710, 420], [800, 418], [887, 425], [887, 460], [790, 455], [690, 455]]
})
raw_regions.append({
    "id": "fountain_mist_cloud_e", "name": "East Fountain Water Mist", "category": "Water",
    "pts": [[545, 450], [610, 455], [690, 455], [790, 455], [887, 460], [887, 485], [740, 485], [600, 480], [545, 475]]
})
raw_regions.append({
    "id": "fountain_pool_water_e", "name": "Reflective Basin Pool (East)", "category": "Water",
    "pts": [[545, 475], [600, 480], [740, 485], [887, 485], [887, 510], [720, 515], [550, 505]]
})

# --- 5. REFLECTIVE PLAZA GROUND & GRANITE BENCH ---
raw_regions.append({
    "id": "plaza_wet_floor_nw", "name": "Wet Granite Tiles (Upper Left)", "category": "Stone",
    "pts": [[0, 500], [150, 505], [320, 500], [300, 560], [130, 565], [0, 555]]
})
raw_regions.append({
    "id": "plaza_reflection_nw", "name": "Sky Reflections on Wet Stone (Left)", "category": "Stone",
    "pts": [[0, 555], [130, 565], [300, 560], [280, 620], [110, 625], [0, 615]]
})
raw_regions.append({
    "id": "bench_top_slab_w", "name": "Polished Granite Bench (Top Surface)", "category": "Stone",
    "pts": [[0, 615], [110, 625], [280, 620], [295, 745], [110, 765], [0, 745]]
})
raw_regions.append({
    "id": "bench_bevel_highlight", "name": "Bench Beveled Edge Chamfer", "category": "Stone",
    "pts": [[0, 680], [120, 680], [120, 705], [0, 705]]
})
raw_regions.append({
    "id": "bench_vertical_wall_upper", "name": "Bench Granite Wall (Upper)", "category": "Stone",
    "pts": [[0, 745], [110, 765], [295, 745], [285, 870], [120, 885], [0, 860]]
})
raw_regions.append({
    "id": "bench_vertical_wall_lower", "name": "Bench Granite Wall (Shadow Base)", "category": "Stone",
    "pts": [[0, 860], [120, 885], [285, 870], [265, 1020], [110, 1035], [0, 1010]]
})
raw_regions.append({
    "id": "bench_plinth_ground", "name": "Bench Foundation Plinth", "category": "Stone",
    "pts": [[0, 1010], [110, 1035], [265, 1020], [240, 1180], [90, 1195], [0, 1170]]
})
raw_regions.append({
    "id": "plaza_wet_floor_ne", "name": "Wet Granite Tiles (Upper Right)", "category": "Stone",
    "pts": [[550, 505], [720, 515], [887, 510], [887, 580], [670, 585], [550, 570]]
})
raw_regions.append({
    "id": "plaza_reflection_ne", "name": "Sky Reflections on Wet Stone (Right)", "category": "Stone",
    "pts": [[550, 570], [670, 585], [887, 580], [887, 670], [650, 675], [560, 650]]
})
raw_regions.append({
    "id": "plaza_wet_floor_me", "name": "Wet Stone Slab (Mid Right)", "category": "Stone",
    "pts": [[560, 650], [650, 675], [887, 670], [887, 780], [630, 790], [565, 755]]
})
raw_regions.append({
    "id": "plaza_foreground_ledge", "name": "Foreground Stone Step Ledge", "category": "Stone",
    "pts": [[630, 790], [887, 780], [887, 980], [620, 995]]
})
raw_regions.append({
    "id": "plaza_foreground_slab_se", "name": "Foreground Granite Pavement (East)", "category": "Stone",
    "pts": [[620, 995], [887, 980], [887, 1280], [580, 1280], [605, 1120]]
})
raw_regions.append({
    "id": "plaza_foreground_slab_sw", "name": "Foreground Granite Pavement (West)", "category": "Stone",
    "pts": [[0, 1170], [90, 1195], [240, 1180], [280, 1280], [0, 1280]]
})
raw_regions.append({
    "id": "plaza_foreground_slab_c", "name": "Foreground Granite Pavement (Center)", "category": "Stone",
    "pts": [[240, 1180], [280, 1280], [580, 1280], [605, 1120], [530, 1180]]
})

# --- 6. SUBJECT: HAIR & WAVES ---
raw_regions.append({
    "id": "hair_crown_top_crest", "name": "Hair Crown Upper Volume", "category": "Hair",
    "pts": [[425, 366], [475, 362], [515, 368], [500, 388], [445, 388]]
})
raw_regions.append({
    "id": "hair_crown_ambient_sheen", "name": "Hair Crown Ambient Sheen", "category": "Hair",
    "pts": [[450, 368], [490, 365], [510, 375], [480, 385], [455, 382]]
})
raw_regions.append({
    "id": "hair_crown_depth_left", "name": "Hair Crown Left Shadow", "category": "Hair",
    "pts": [[385, 395], [425, 366], [445, 388], [415, 410], [375, 415]]
})
raw_regions.append({
    "id": "hair_crown_depth_right", "name": "Hair Crown Right Shadow", "category": "Hair",
    "pts": [[515, 368], [555, 385], [575, 415], [535, 415], [500, 388]]
})
raw_regions.append({
    "id": "hair_left_curl_upper", "name": "Left Shoulder Wave (Upper Crest)", "category": "Hair",
    "pts": [[365, 415], [415, 410], [435, 442], [395, 465], [355, 445]]
})
raw_regions.append({
    "id": "hair_left_curl_sheen", "name": "Left Wave Sheen Highlight", "category": "Hair",
    "pts": [[375, 435], [405, 430], [400, 460], [370, 455]]
})
raw_regions.append({
    "id": "hair_left_curl_mid", "name": "Left Shoulder Wave (Mid Curl)", "category": "Hair",
    "pts": [[355, 445], [395, 465], [410, 505], [360, 515], [335, 485]]
})
raw_regions.append({
    "id": "hair_left_curl_lower", "name": "Left Cascading Curl Tail", "category": "Hair",
    "pts": [[335, 485], [360, 515], [390, 535], [345, 550], [325, 520]]
})
raw_regions.append({
    "id": "hair_left_nape_shadow", "name": "Left Nape Shadow", "category": "Hair",
    "pts": [[390, 515], [435, 510], [440, 545], [390, 545]]
})
raw_regions.append({
    "id": "hair_right_tuck_shadow", "name": "Right Tucked Wave Shadow", "category": "Hair",
    "pts": [[535, 415], [575, 415], [595, 455], [565, 475], [535, 455]]
})
raw_regions.append({
    "id": "hair_right_tuck_highlight", "name": "Right Tucked Wave Highlight", "category": "Hair",
    "pts": [[550, 420], [580, 425], [585, 450], [555, 445]]
})
raw_regions.append({
    "id": "hair_right_curl_lower", "name": "Right Shoulder Wave Volume", "category": "Hair",
    "pts": [[565, 475], [605, 475], [618, 525], [565, 545], [540, 520], [545, 485]]
})
raw_regions.append({
    "id": "hair_right_curl_sheen", "name": "Right Wave Strand Sheen", "category": "Hair",
    "pts": [[575, 490], [600, 490], [595, 520], [570, 515]]
})

# --- 7. SUBJECT: FACE & SKIN TONES ---
raw_regions.append({
    "id": "face_forehead_upper", "name": "Forehead Upper Tone", "category": "Skin",
    "pts": [[438, 410], [475, 402], [512, 410], [510, 425], [440, 425]]
})
raw_regions.append({
    "id": "face_forehead_glow", "name": "Forehead Radiant Glow", "category": "Skin",
    "pts": [[455, 412], [490, 408], [505, 422], [455, 422]]
})
raw_regions.append({
    "id": "face_left_brow", "name": "Left Eyebrow Contour", "category": "Skin",
    "pts": [[442, 432], [472, 432], [474, 442], [442, 442]]
})
raw_regions.append({
    "id": "face_right_brow", "name": "Right Eyebrow Contour", "category": "Skin",
    "pts": [[486, 430], [516, 428], [518, 438], [486, 440]]
})
raw_regions.append({
    "id": "face_left_eye", "name": "Left Eye & Soft Shadow", "category": "Skin",
    "pts": [[444, 442], [474, 442], [472, 455], [444, 452]]
})
raw_regions.append({
    "id": "face_right_eye", "name": "Right Eye & Soft Shadow", "category": "Skin",
    "pts": [[486, 440], [516, 438], [516, 452], [486, 452]]
})
raw_regions.append({
    "id": "face_nose_bridge", "name": "Nose Bridge Highlight", "category": "Skin",
    "pts": [[474, 440], [486, 440], [488, 465], [472, 465]]
})
raw_regions.append({
    "id": "face_nose_tip", "name": "Nose Tip Highlight", "category": "Skin",
    "pts": [[473, 465], [489, 465], [492, 476], [470, 476]]
})
raw_regions.append({
    "id": "face_left_cheek_glow", "name": "Left Cheek Sunlit Glow", "category": "Skin",
    "pts": [[435, 445], [468, 452], [465, 475], [435, 468]]
})
raw_regions.append({
    "id": "face_left_cheek_blush", "name": "Left Cheek Rose Blush", "category": "Skin",
    "pts": [[442, 455], [465, 458], [462, 472], [440, 470]]
})
raw_regions.append({
    "id": "face_right_cheek_glow", "name": "Right Cheek Sunlit Glow", "category": "Skin",
    "pts": [[495, 448], [528, 442], [528, 472], [498, 478]]
})
raw_regions.append({
    "id": "face_right_cheek_contour", "name": "Right Cheek Smile Contour", "category": "Skin",
    "pts": [[502, 455], [524, 450], [524, 468], [502, 472]]
})
raw_regions.append({
    "id": "face_lips_upper", "name": "Upper Lip Contour", "category": "Skin",
    "pts": [[470, 478], [484, 475], [500, 478], [495, 486], [484, 484], [472, 485]]
})
raw_regions.append({
    "id": "face_lips_lower", "name": "Lower Lip Radiant Smile", "category": "Skin",
    "pts": [[472, 485], [484, 484], [495, 486], [496, 496], [484, 498], [472, 495]]
})
raw_regions.append({
    "id": "face_chin_highlight", "name": "Chin Radiant Glow", "category": "Skin",
    "pts": [[470, 498], [496, 498], [498, 514], [468, 514]]
})
raw_regions.append({
    "id": "face_jawline_shadow", "name": "Jawline Warm Umber Shadow", "category": "Skin",
    "pts": [[445, 490], [468, 514], [498, 514], [525, 490], [530, 508], [485, 522], [440, 505]]
})
raw_regions.append({
    "id": "face_neck_upper", "name": "Neck Center Warmth", "category": "Skin",
    "pts": [[465, 518], [505, 518], [508, 538], [462, 538]]
})
raw_regions.append({
    "id": "face_neck_throat_shadow", "name": "Throat Depth Shadow", "category": "Skin",
    "pts": [[462, 538], [508, 538], [515, 550], [455, 550]]
})

# --- 8. HANDS & ARMS ---
raw_regions.append({
    "id": "hand_left_fingers_touch", "name": "Left Fingers Touching Hair", "category": "Skin",
    "pts": [[565, 415], [595, 415], [605, 435], [570, 438]]
})
raw_regions.append({
    "id": "hand_left_knuckles", "name": "Left Hand Knuckles & Palm", "category": "Skin",
    "pts": [[570, 438], [605, 435], [612, 452], [575, 455]]
})
raw_regions.append({
    "id": "hand_left_wrist_skin", "name": "Left Wrist Skin", "category": "Skin",
    "pts": [[585, 455], [615, 452], [615, 472], [580, 475]]
})
raw_regions.append({
    "id": "hand_right_wrist_skin", "name": "Right Wrist Skin", "category": "Skin",
    "pts": [[285, 792], [325, 792], [325, 815], [285, 815]]
})
raw_regions.append({
    "id": "hand_right_palm_fingers", "name": "Right Hand & Fingers", "category": "Skin",
    "pts": [[285, 825], [328, 825], [325, 885], [290, 885]]
})

# --- 9. INNER BLACK LONG-SLEEVE SHIRT ---
raw_regions.append({
    "id": "shirt_scoop_collar", "name": "Inner Shirt Scoop Collar", "category": "Inner Top",
    "pts": [[440, 550], [515, 550], [525, 570], [430, 570]]
})
raw_regions.append({
    "id": "shirt_left_shoulder", "name": "Left Sleeve Shoulder Drape", "category": "Inner Top",
    "pts": [[575, 495], [640, 480], [665, 535], [595, 550]]
})
raw_regions.append({
    "id": "shirt_left_bicep_fold", "name": "Left Sleeve Bicep Fold", "category": "Inner Top",
    "pts": [[595, 550], [665, 535], [670, 580], [605, 585]]
})
raw_regions.append({
    "id": "shirt_left_forearm", "name": "Left Sleeve Forearm (Fold)", "category": "Inner Top",
    "pts": [[605, 585], [670, 580], [675, 620], [612, 625]]
})
raw_regions.append({
    "id": "shirt_right_shoulder", "name": "Right Sleeve Shoulder Drape", "category": "Inner Top",
    "pts": [[325, 528], [375, 525], [370, 595], [315, 590]]
})
raw_regions.append({
    "id": "shirt_right_bicep", "name": "Right Sleeve Bicep Drape", "category": "Inner Top",
    "pts": [[315, 590], [370, 595], [360, 675], [300, 670]]
})
raw_regions.append({
    "id": "shirt_right_elbow_crease", "name": "Right Sleeve Elbow Crease", "category": "Inner Top",
    "pts": [[300, 670], [360, 675], [350, 735], [295, 730]]
})
raw_regions.append({
    "id": "shirt_right_forearm_cuff", "name": "Right Sleeve Forearm & Cuff", "category": "Inner Top",
    "pts": [[295, 730], [350, 735], [335, 792], [285, 792]]
})

# --- 10. BURGUNDY JUMPSUIT ---
raw_regions.append({
    "id": "jumpsuit_strap_west", "name": "Spaghetti Strap (West)", "category": "Burgundy",
    "pts": [[408, 545], [425, 545], [422, 570], [405, 570]]
})
raw_regions.append({
    "id": "jumpsuit_strap_east", "name": "Spaghetti Strap (East)", "category": "Burgundy",
    "pts": [[535, 545], [552, 545], [548, 570], [532, 570]]
})
raw_regions.append({
    "id": "jumpsuit_bodice_neckline", "name": "Bodice Neckline Band", "category": "Burgundy",
    "pts": [[395, 570], [560, 570], [565, 605], [390, 605]]
})
raw_regions.append({
    "id": "jumpsuit_chest_left_panel", "name": "Upper Chest Panel (Left)", "category": "Burgundy",
    "pts": [[390, 605], [475, 605], [475, 665], [380, 665]]
})
raw_regions.append({
    "id": "jumpsuit_chest_right_panel", "name": "Upper Chest Panel (Right)", "category": "Burgundy",
    "pts": [[475, 605], [565, 605], [570, 665], [475, 665]]
})
raw_regions.append({
    "id": "jumpsuit_chest_glow", "name": "Upper Chest Velvet Sheen", "category": "Burgundy",
    "pts": [[440, 615], [510, 615], [515, 655], [435, 655]]
})
raw_regions.append({
    "id": "jumpsuit_torso_side_shadow_w", "name": "Bodice Side Shadow (Left)", "category": "Burgundy",
    "pts": [[350, 620], [390, 605], [380, 710], [340, 715]]
})
raw_regions.append({
    "id": "jumpsuit_torso_mid_panel", "name": "Torso Mid Panel", "category": "Burgundy",
    "pts": [[380, 665], [570, 665], [575, 715], [375, 715]]
})
raw_regions.append({
    "id": "jumpsuit_torso_side_shadow_e", "name": "Bodice Side Shadow (Right)", "category": "Burgundy",
    "pts": [[565, 605], [605, 630], [595, 715], [575, 715]]
})
raw_regions.append({
    "id": "jumpsuit_waistband_contour", "name": "Waistline Seam & Contour", "category": "Burgundy",
    "pts": [[340, 715], [595, 715], [590, 755], [345, 765]]
})
raw_regions.append({
    "id": "jumpsuit_hip_pleat_shadow_e", "name": "Right Hip & Pleat Shadow", "category": "Burgundy",
    "pts": [[560, 715], [605, 735], [605, 815], [550, 785]]
})
raw_regions.append({
    "id": "jumpsuit_center_seam_crease", "name": "Trouser Inseam Front Crease", "category": "Burgundy",
    "pts": [[445, 755], [465, 755], [460, 1050], [440, 1050]]
})
raw_regions.append({
    "id": "jumpsuit_trouser_w_hip", "name": "Left Trouser Hip Drape", "category": "Burgundy",
    "pts": [[330, 765], [445, 755], [440, 850], [320, 850]]
})
raw_regions.append({
    "id": "jumpsuit_trouser_w_thigh", "name": "Left Trouser Thigh Front", "category": "Burgundy",
    "pts": [[320, 850], [440, 850], [435, 950], [315, 950]]
})
raw_regions.append({
    "id": "jumpsuit_trouser_w_knee", "name": "Left Trouser Knee Fold Highlight", "category": "Burgundy",
    "pts": [[315, 950], [435, 950], [430, 1060], [310, 1060]]
})
raw_regions.append({
    "id": "jumpsuit_trouser_w_shin", "name": "Left Trouser Shin Drape", "category": "Burgundy",
    "pts": [[310, 1060], [430, 1060], [425, 1180], [305, 1180]]
})
raw_regions.append({
    "id": "jumpsuit_trouser_w_hem", "name": "Left Trouser Lower Hem Fall", "category": "Burgundy",
    "pts": [[305, 1180], [425, 1180], [420, 1280], [300, 1280]]
})
raw_regions.append({
    "id": "jumpsuit_trouser_w_outer_shadow", "name": "Left Trouser Outer Seam Shadow", "category": "Burgundy",
    "pts": [[300, 850], [320, 850], [315, 1180], [295, 1180]]
})
raw_regions.append({
    "id": "jumpsuit_trouser_e_hip", "name": "Right Trouser Hip Drape", "category": "Burgundy",
    "pts": [[465, 755], [580, 755], [575, 850], [460, 850]]
})
raw_regions.append({
    "id": "jumpsuit_trouser_e_thigh", "name": "Right Trouser Thigh Front", "category": "Burgundy",
    "pts": [[460, 850], [575, 850], [570, 950], [455, 950]]
})
raw_regions.append({
    "id": "jumpsuit_trouser_e_knee", "name": "Right Trouser Knee Fold Highlight", "category": "Burgundy",
    "pts": [[455, 950], [570, 950], [565, 1060], [450, 1060]]
})
raw_regions.append({
    "id": "jumpsuit_trouser_e_shin", "name": "Right Trouser Shin Drape", "category": "Burgundy",
    "pts": [[450, 1060], [565, 1060], [560, 1180], [445, 1180]]
})
raw_regions.append({
    "id": "jumpsuit_trouser_e_hem", "name": "Right Trouser Lower Hem Fall", "category": "Burgundy",
    "pts": [[445, 1180], [560, 1180], [550, 1280], [435, 1280]]
})
raw_regions.append({
    "id": "jumpsuit_trouser_e_inner_shadow", "name": "Right Trouser Inseam Shadow", "category": "Burgundy",
    "pts": [[440, 1050], [460, 1050], [455, 1280], [435, 1280]]
})

# --- 11. ACCESSORIES: GOLD WATCH & PEARL BRACELET ---
raw_regions.append({
    "id": "gold_watch_bezel", "name": "Radiant Gold Watch Bezel", "category": "Accents",
    "pts": [[610, 465], [635, 465], [638, 485], [612, 485]]
})
raw_regions.append({
    "id": "gold_watch_dial_sheen", "name": "Gold Watch Face Sheen", "category": "Accents",
    "pts": [[616, 469], [630, 469], [632, 481], [617, 481]]
})
raw_regions.append({
    "id": "pearl_bracelet_chain", "name": "Delicate Wrist Bracelet", "category": "Accents",
    "pts": [[288, 810], [330, 810], [330, 822], [288, 822]]
})
raw_regions.append({
    "id": "pearl_bracelet_bead", "name": "Bracelet Shimmering Bead", "category": "Accents",
    "pts": [[302, 812], [316, 812], [316, 820], [302, 820]]
})

print(f"Total raw regions defined: {len(raw_regions)}")

# Process each region: smooth spline curves, compute center, and sample color from real photograph
final_regions = []
for reg in raw_regions:
    smoothed_pts = smooth_curve(reg["pts"], steps=3)
    c_color = sample_color(smoothed_pts)
    
    xs = [p[0] for p in smoothed_pts]
    ys = [p[1] for p in smoothed_pts]
    cx = round(sum(xs) / len(xs), 1)
    cy = round(sum(ys) / len(ys))
    
    final_regions.append({
        "id": reg["id"],
        "name": reg["name"],
        "category": reg["category"],
        "color": c_color,
        "center": [cx, cy],
        "points": smoothed_pts
    })

# Now build a curated artist color palette from the sampled colors
# Cluster into ~24 harmonious artist palette shades
categories = list(set(r["category"] for r in final_regions))
palette = []
hex_to_swatch = {}

for cat in ["Atmosphere", "Nature", "Stone", "Water", "Hair", "Skin", "Inner Top", "Burgundy", "Accents"]:
    cat_regs = [r for r in final_regions if r["category"] == cat]
    if not cat_regs: continue
    # Group unique colors in this category
    unique_colors = sorted(list(set(r["color"] for r in cat_regs)))
    for idx, hex_col in enumerate(unique_colors):
        swatch_id = f"{cat.lower().replace(' ', '_')}_{idx+1}"
        swatch = {
            "id": swatch_id,
            "hex": hex_col,
            "name": f"{cat} Shade {idx+1}",
            "family": cat
        }
        palette.append(swatch)
        hex_to_swatch[hex_col] = swatch

print(f"Created palette with {len(palette)} distinct artist swatches across {len(categories)} categories.")

# Generate JS module
js_code = f"""/**
 * Detailed Painting Regions Dataset for Eshal's Mystery Artwork
 * Dimensions: 887 x 1280 (Native photograph aspect ratio ~ 0.693)
 *
 * Generated with high-density natural curved contours directly sampled from:
 * src/assets/mystery/eshal.jpeg
 * Total Regions: {len(final_regions)}
 */

export const CANVAS_WIDTH = 887;
export const CANVAS_HEIGHT = 1280;

export const COLOR_PALETTE = {json.dumps(palette, indent=2)};

export const PAINTING_REGIONS = {json.dumps(final_regions, indent=2)};
"""

with open("src/data/paintingRegions.js", "w", encoding="utf-8") as f:
    f.write(js_code)

print("Saved updated src/data/paintingRegions.js successfully!")

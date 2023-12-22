from imageai.Detection.Custom import CustomObjectDetection
import math
import random
from cv2 import imread, imwrite, circle, imshow, waitKey
import os

# This model work (after processing) with error rate=12.125%
# and accuracy=87.875%
# computed by taking 11 measurments:
# 1_ 0.117647 ¦ 2_ 0.0526316 ¦ 3_ 0.0952381 ¦ 4_ 0 ¦ 5_ 0.470588
# 6_ 0.047619 ¦ 7_ 0.157895 ¦ 8_ 0.0588235 ¦ 9_ 0.055556 ¦ 10_ 0.277778 ¦ 11_ 0


def detect(image):
    detector = CustomObjectDetection()
    detector.setModelTypeAsTinyYOLOv3()
    detector.setModelPath(
        'tiny-yolov3_BCCD_last.pt'
    )
    detector.setJsonPath(
        'BCCD_tiny-yolov3_detection_config.json'
    )
    detector.loadModel()

    detections = detector.detectObjectsFromImage(
        output_type='file',
        input_image=image,
    )
    return detections


def proccessing(detections):
    cells = []
    for i in range(len(detections)):
        count = 0
        for j in range(i + 1, len(detections)):
            box1 = detections[i]['box_points']
            box2 = detections[j]['box_points']
            x_range1 = range(box1[0], box1[2] + 1)
            y_range1 = range(box1[1], box1[3] + 1)
            p11 = (box1[0], box1[1])
            p12 = (box1[2], box1[1])
            p13 = (box1[0], box1[3])
            p14 = (box1[2], box1[3])
            x_range2 = range(box2[0], box2[2] + 1)
            y_range2 = range(box2[1], box2[3] + 1)
            p21 = (box2[0], box2[1])
            p22 = (box2[2], box2[1])
            p23 = (box2[0], box2[3])
            p24 = (box2[2], box2[3])
            if detections[i]['name'] == detections[j]['name'] == 'RBC':
                if ((p11[0] <= p21[0] and p11[1] <= p21[1])
                        and (p14[0] >= p24[0] and p14[1] >= p24[1])):
                    count += 1
                elif ((p21[0] <= p11[0] and p21[1] <= p11[1])
                        and (p24[0] >= p14[0] and p24[1] >= p14[1])):
                    detections[i], detections[j] = detections[j], detections[i]
                    count += 1
            if (detections[i]['name'] != 'RBC'
                    and detections[i]['name'] == detections[j]['name']):
                if ((p21[0] in x_range1 and p21[1] in y_range1)
                        or (p22[0] in x_range1 and p22[1] in y_range1)
                        or (p23[0] in x_range1 and p23[1] in y_range1)
                        or (p24[0] in x_range1 and p24[1] in y_range1)):
                    count += 1
                elif ((p11[0] in x_range2 and p11[1] in y_range2)
                        or (p12[0] in x_range2 and p12[1] in y_range2)
                        or (p13[0] in x_range2 and p13[1] in y_range2)
                        or (p14[0] in x_range2 and p14[1] in y_range2)):
                    detections[i], detections[j] = detections[j], detections[i]
                    count += 1
        if count == 0:
            cells.append(detections[i])
    return cells


def cells_count(cells):
    platelets = wbcs = rbcs = 0

    for cell in cells:
        name = cell['name']
        if name == 'Platelets':
            platelets += 1
        elif name == 'RBC':
            rbcs += 1
        elif name == 'WBC':
            wbcs += 1
    platelets = platelets * 3.66212
    # platelets = platelets * 200 / (1.36533 * 10 * 4) [10^5/ul]
    rbcs = rbcs * 0.366212
    # rbcs = rbcs * 200 / (1.36533 * 100 * 4) [10^6/ul]
    wbcs = wbcs * 7.32424
    # wbcs = wbcs / 0.136533 [10^3/ul]
    hemoglobin = rbcs * 3
    # hemoglobin = (rbcs [10^6/ul] * 3) [g/dl]
    platelets = round(platelets, 3)
    rbcs = round(rbcs, 3)
    wbcs = round(wbcs, 3)
    hemoglobin = round(hemoglobin, 3)

    return (platelets, rbcs, wbcs, hemoglobin)


def hematocrit_calc(rbcs, mcv):
    hematocrit = round(rbcs * mcv / 10, 3)
    # mcv(fl) = 10 * hematocrit(%) / rbcs(10^6/ul)
    return hematocrit


def mch_mchc(hemoglobin, rbcs, hematocrit):
    MCH = round(10 * hemoglobin / rbcs, 3)
    # MCH(pg) = (hemoglobin(g/dl) / rbcs(10^6/ul)) * 10
    MCHC = round(100 * hemoglobin / hematocrit, 3)
    # MCHC(%) = (hemoglobin(g/dl) / hematocrit(%)) * 100

    return (MCH, MCHC)


def mcv_rdw(cells):
    diameteres = []
    for c in cells:
        if c['name'] == 'RBC':
            box = c['box_points']
            width = box[2] - box[0]
            height = box[3] - box[1]
            diametere = min(height, width) / 15
            diameteres.append(diametere)
    diameteres.remove(min(diameteres))
    diameteres.remove(max(diameteres))
    r_avg = (sum(diameteres) / len(diameteres)) / 2
    h = 2.5
    MCV = math.pi * h * r_avg ** 2

    r_vol = random.choice(diameteres) / 2
    vol = math.pi * h * r_vol ** 2
    RDW = (abs(MCV - vol) / MCV) * 100
    MCV = round(MCV, 3)
    RDW = round(RDW, 3)
    return MCV, RDW

'''
img = imread(
    'grad-project/dist/media/images/5851be13-56c2-4fb0-85d9-788c766690d3.jpg'
)
detections = detect(
    'grad-project/dist/media/images/5851be13-56c2-4fb0-85d9-788c766690d3.jpg'
)
cells = proccessing(detections)

platelets, rbcs, wbcs, hgb = cells_count(cells)

mcv, rdw = mcv_rdw(cells)

hct = hematocrit_calc(rbcs, mcv)

mch, mchc = mch_mchc(hgb, rbcs, hct)

print('platelets: ', platelets)
print('rbcs: ', rbcs)
print('wbcs: ', wbcs)
print('hgb: ', hgb)
print('mcv: ', mcv)
print('rdw: ', rdw)
print('hct: ', hct)
print('mch: ', mch)
print('mchc: ', mchc)

for c in cells:
    if c['name'] == 'RBC':
        color = (0, 0, 255)
    elif c['name'] == 'WBC':
        color = (255, 0, 0)
    else:
        color = (0, 255, 0)
    p = (
        (c['box_points'][0] + c['box_points'][2]) // 2,
        (c['box_points'][1] + c['box_points'][3]) // 2
    )
    circle(
        img,
        p,
        (c['box_points'][3] - c['box_points'][1]) // 2,
        color,
        thickness=2
    )
imwrite('grad-project/dist/media/results/6_1.jpg', img)
imshow('img', img)
waitKey(0)
'''

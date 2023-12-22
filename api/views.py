from rest_framework.decorators import \
    api_view, permission_classes, authentication_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import login, logout
from django.http.response import FileResponse
from .serializers import *
from .cbc import *
from cv2 import imread, imwrite, circle
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase.pdfmetrics import registerFont
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Table
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
from PIL import Image
from io import BytesIO
import base64
import traceback
import os

BASE_DIR = os.getcwd() + '\\grad-project\\dist'


@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([AllowAny])
def register_user(request, format=None):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        user = serializer.create(request.data)
        if user:
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([AllowAny])
def login_user(request, format=None):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        user = serializer.check_user(request.data)
        login(request, user)
        print(request.user.is_authenticated)
        return Response(serializer.data['email'], status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([AllowAny])
def check_user(request, format=None):
    print(BASE_DIR)
    return Response(request.user.is_authenticated, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def logout_user(request, format=None):
    logout(request)
    print(request.user.is_authenticated)
    return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def patients_list(request, format=None):
    patients = Patient.objects.filter(
        supervisor=request.user
    ).order_by('created_at')
    serializer = PatientSerializer(patients, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def patient_details(request, pk, format=None):
    try:
        patient = Patient.objects.get(id=pk)
        images = ImageModel.objects.filter(patient=patient)
        serializer = PatientSerializer(patient)
        img_serializer = ImageSerializer(images, many=True)
        data = serializer.data
        data['images'] = img_serializer.data
        return Response(data, status=status.HTTP_200_OK)
    except Exception:
        return Response('Patient not found', status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def create_patient(request, format=None):
    data = request.data
    images = data.pop('images')
    data['supervisor'] = request.user.user_id
    serializer = PatientSerializer(data=data)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
    res = serializer.data
    if images:
        imgs_data = []
        for image in images:
            img_data = {'image': image, 'patient': res['id']}
            imgs_data.append(img_data)
        img_serializer = ImageSerializer(data=imgs_data, many=True)
        if img_serializer.is_valid(raise_exception=True):
            img_serializer.save()
        res['images'] = img_serializer.data
    return Response(res, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def delete_patient(request, pk, format=None):
    try:
        patient = Patient.objects.get(id=pk)
        patient.delete()
        return Response(status=status.HTTP_200_OK)
    except Exception:
        traceback.print_exc()
        return Response('Patient not found', status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def update_patient(request, pk, format=None):
    data = request.data
    images = data.pop('images')
    try:
        patient = Patient.objects.get(id=pk)
        if request.user.user_id == patient.supervisor.user_id:
            data['supervisor'] = request.user.user_id
            serializer = PatientSerializer(instance=patient, data=data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
            res = serializer.data
            if images:
                res['images'] = []
                imgs = ImageModel.objects.filter(patient=patient)
                if len(images) == len(imgs):
                    for i in range(len(images)):
                        file = open(BASE_DIR + images[i]['image'], 'rb')
                        string = base64.b64encode(file.read())
                        print(string)
                        img_data = {'image': string.decode(), 'patient': pk}
                        img_serializer = ImageSerializer(
                            instance=imgs[i],
                            data=img_data
                        )
                        file.close()
                        if img_serializer.is_valid(raise_exception=True):
                            img_serializer.save()
                            res['images'].append(img_serializer.data)
                elif len(images) < len(imgs):
                    imgs_data = []
                    for img in imgs:
                        img.delete()
                    for im in images:
                        file = open(BASE_DIR + im['image'], 'rb')
                        string = base64.b64encode(file.read())
                        print(string)
                        imgs_data.append({'image': string.decode(), 'patient': pk})
                        file.close()
                    img_serializer = ImageSerializer(data=imgs_data, many=True)
                    if img_serializer.is_valid(raise_exception=True):
                        img_serializer.save()
                        res['images'] = img_serializer.data
                else:
                    for i in range(len(imgs)):
                        file = open(BASE_DIR + images[i]['image'], 'rb')
                        string = base64.b64encode(file.read())
                        print(string)
                        img_data = {'image': string.decode(), 'patient': pk}
                        img_serializer = ImageSerializer(
                            instance=imgs[i],
                            data=img_data
                        )
                        file.close()
                        if img_serializer.is_valid(raise_exception=True):
                            img_serializer.save()
                            res['images'].append(img_serializer.data)
                    data_imgs = []
                    for i in range(len(imgs), len(images)):
                        file = open(BASE_DIR + images[i]['image'], 'rb')
                        string = base64.b64encode(file.read())
                        data_imgs.append(
                            {'image': string.decode(), 'patient': pk}
                        )
                        file.close()
                    add_serializer = ImageSerializer(data=data_imgs, many=True)
                    if add_serializer.is_valid(raise_exception=True):
                        add_serializer.save()
                    for d in add_serializer.data:
                        res['images'].append(d)
            return Response(res, status=status.HTTP_200_OK)
        else:
            return Response("You can't edit this patient,"
                            " you must be his/her supervisor.",
                            status=status.HTTP_401_UNAUTHORIZED)
    except Exception:
        traceback.print_exc()
        return Response('Patient not found', status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def cbc_result(request, pk, format=None):
    try:
        rbcs = []
        wbcs = []
        platelets = []
        mcvs = []
        hgbs = []
        mchcs = []
        mchs = []
        rdws = []
        hcts = []
        patient = Patient.objects.get(id=pk)
        images = ImageModel.objects.filter(patient=patient)
        for i in images:
            rbc = wbc = platelet = mcv = hgb = mchc = mch = rdw = hct = 0
            detections = detect('grad-project/dist/media/' + str(i.image))
            cells = proccessing(detections)
            img_read = imread('grad-project/dist/media/' + str(i.image))
            for c in cells:
                if c['name'] == 'Platelets':
                    color = (0, 255, 0)
                elif c['name'] == 'RBC':
                    color = (0, 0, 255)
                else:
                    color = (255, 0, 0)
                p = (
                    (c['box_points'][0] + c['box_points'][2]) // 2,
                    (c['box_points'][1] + c['box_points'][3]) // 2
                )
                circled = circle(
                    img_read,
                    p,
                    (c['box_points'][3] - c['box_points'][1]) // 2,
                    color,
                    thickness=2
                )
            imwrite(
                f'grad-project/dist/media/results/{i.patient.id}_{i.id}.jpg',
                circled
            )
            platelet, rbc, wbc, hgb = cells_count(cells)
            mcv, rdw = mcv_rdw(cells)
            hct = hematocrit_calc(rbc, mcv)
            mch, mchc = mch_mchc(hgb, rbc, hct)
            rbcs.append(rbc)
            wbcs.append(wbc)
            platelets.append(platelet)
            hcts.append(hct)
            mcvs.append(mcv)
            hgbs.append(hgb)
            mchs.append(mch)
            mchcs.append(mchc)
            rdws.append(rdw)
        result = {
            'rbcs': round(sum(rbcs) / len(rbcs), 2),
            'wbcs': round(sum(wbcs) / len(wbcs), 2),
            'platelets': round(sum(platelets) / len(platelets), 2),
            'hgb': round(sum(hgbs) / len(hgbs), 2),
            'hct': round(sum(hcts) / len(hcts), 2),
            'mcv': round(sum(mcvs) / len(mcvs), 2),
            'mch': round(sum(mchs) / len(mchs), 2),
            'mchc': round(sum(mchcs) / len(mchcs), 2),
            'rdw': round(sum(rdws) / len(rdws), 2),
            'patient': pk
        }
        serializer = ResultSerializer(data=result)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(result, status=status.HTTP_200_OK)
    except Exception:
        return Response('Patient not found.', status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def download_result(request, pk, format=None):
    images = ImageModel.objects.filter(patient_id=pk)
    results = Result.objects.filter(patient_id=pk).order_by('-created_at')
    result = results[0]
    rdw_ref = '11.8 - 15.6'
    mchc_ref = '33 - 36'
    mch_ref = '27 - 32'
    mcv_ref = '80 - 100'
    platelets_ref = '1.5 - 4.5'
    if result.patient.age < 12:
        hct_ref = '36 - 44'
        if result.patient.age < 2:
            hgb_ref = '11.3 - 14.1'
            rbc_ref = '4.2 - 5.3'
            wbc_ref = '6.2 - 17'
        else:
            wbc_ref = '4.5 - 11'
            if result.patient.age < 6:
                rbc_ref = '4.2 - 5'
                hgb_ref = '10.9 - 15'
            else:
                rbc_ref = '4.3 - 5.1'
                hgb_ref = '11.9 - 15'
    else:
        wbc_ref = '4.5 - 11'
        if result.patient.sexuality == 'male':
            hct_ref = '38.8 - 50'
            rbc_ref = '4.7 - 6.1'
            hgb_ref = '13 - 18'
        else:
            hct_ref = '34.9 - 44.5'
            rbc_ref = '4 - 5'
            hgb_ref = '12 - 16'
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4, bottomup=False)
    c.setTitle('CBC Result')
    font1 = TTFont('Georgia', 'Georgia.ttf')
    font2 = TTFont('Verdana', 'Verdana.ttf')
    registerFont(font1)
    registerFont(font2)
    c.setFillColor('red')
    c.roundRect(220, 17, 150, 50, fill=1, stroke=0, radius=4)
    c.line(100, 80, 495, 80)
    logo = Image.open(
        'grad-project/dist/media/images/logo.jpg'
    ).transpose(Image.FLIP_TOP_BOTTOM)
    c.drawImage(ImageReader(logo), 25, 17, width=50, height=50)
    c.setFont('Georgia', 24)
    c.setFillColor('white')
    c.drawCentredString(295, 50, 'CBC Result')
    c.setFillColor('black')
    date = str(result.created_at).split('.')[0]
    c.drawCentredString(295, 100, f'Created_at: {date}')

    data = [['RDW(%)', result.rdw, rdw_ref],
            ['MCHC(g/dl)', result.mchc, mchc_ref],
            ['MCH(pg)', result.mch, mch_ref],
            ['MCV(fl)', result.mcv, mcv_ref],
            ['HCT(%)', result.hct, hct_ref],
            ['HGB(g/dl)', result.hgb, hgb_ref],
            ['Platelets(x10⁵/μl)', result.platelets, platelets_ref],
            ['WBCs(x10³/μl)', result.wbcs, wbc_ref],
            ['RBCs(x10⁶/μl)', result.rbcs, rbc_ref],
            ['Test', 'Result', 'Reference']]
    style = [
        ('FONT', (0, 0), (-1, -1), 'Verdana', 12),
        ('INNERGRID', (1, 0), (-1, -2), 0.5, colors.red),
        ('BOX', (0, 0), (-1, -1), 2, colors.red),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TEXTCOLOR', (1, 0), (-1, -2), colors.darkred),
        ('BACKGROUND', (1, 0), (-1, -2), colors.antiquewhite),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.antiquewhite),
        ('TEXTCOLOR', (0, -1), (-1, -1), colors.antiquewhite),
        ('BACKGROUND', (0, 0), (0, -1), colors.fidred),
        ('BACKGROUND', (0, -1), (-1, -1), colors.fidred),
        ('LINEABOVE', (0, -1), (-1, -1), 2, colors.red),
        ('LINEAFTER', (0, -1), (-1, -1), 2, colors.red),
        ('LINEABOVE', (0, 0), (0, -1), 2, colors.red),
        ('LINEAFTER', (0, 0), (0, -1), 2, colors.red)
    ]
    t = Table(
        data,
        style=style,
        cornerRadii=[5, 5, 5, 5],
        rowHeights=40,
        colWidths=120
    )
    t.wrapOn(c, 360, 360)
    t.drawOn(c, 115, 200)
    c.showPage()
    for i in images:
        pil_img = Image.open(
            f'grad-project/dist/media/results/{i.patient.id}_{i.id}.jpg'
        ).transpose(Image.FLIP_TOP_BOTTOM)
        c.drawImage(ImageReader(pil_img),
                    84,
                    261,
                    width=427,
                    height=320)
        c.showPage()
    c.save()
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename='result.pdf')


'''
width=595
height=842
for image in images:
                img_serializer = ImageSerializer(instance=img, data=img_data)
                if img_serializer.is_valid(raise_exception=True):
                    img_serializer.save()
                res['images'] = img_serializer.data
{
"username": "bashar",
"email": "bashar.memory@gmail.com",
"password": "besho.!@besho"
}
{
"username": "basel",
"email": "basellogin9@gmail.com",
"password": "basel.grad"
}
{
"username": "Ali Abu Oun",
"email": "ali.abu.oun@gmail.com",
"password": "alialoosh123"
}
{
"username": "Abdulmajeed",
"email": "abd.grad@gmail.com",
"password": "abdabood123"
}
'''

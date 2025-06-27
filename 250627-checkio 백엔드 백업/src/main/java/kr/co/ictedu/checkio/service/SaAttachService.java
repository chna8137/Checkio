package kr.co.ictedu.checkio.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.io.IOException;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.vision.v1.AnnotateImageRequest;
import com.google.cloud.vision.v1.AnnotateImageResponse;
import com.google.cloud.vision.v1.BatchAnnotateImagesResponse;
import com.google.cloud.vision.v1.Feature;
import com.google.cloud.vision.v1.Image;
import com.google.cloud.vision.v1.ImageAnnotatorClient;
import com.google.protobuf.ByteString;

import kr.co.ictedu.checkio.dao.SaAttachDao;
import kr.co.ictedu.checkio.vo.SaAttachVO;

@Service
public class SaAttachService {

    @Autowired
    private SaAttachDao saAttachDao;

    public List<String> extractTextFromMultipartFiles(MultipartFile[] files) throws Exception {

        List<String> resultList = new ArrayList<>();

        if (files == null || files.length == 0) {
            System.out.println("입력된 파일이 없습니다.");
            return resultList;
        }

        for (MultipartFile file : files) {

            if (file == null || file.isEmpty()) {
                System.out.println("빈 파일이거나 null입니다. 건너뜁니다.");
                continue;
            }

            String fileName = file.getOriginalFilename().toLowerCase();
            String extractedText = "";

            if (fileName.endsWith(".pdf")) {
                extractedText = extractTextFromPdf(file);
            } else {
                extractedText = extractTextFromImage(file);
            }

            if (extractedText == null || extractedText.trim().isEmpty()) {
                resultList.add("텍스트 없음");
            } else {
                resultList.add(extractedText);
            }
        }

        return resultList;
    }

    private String extractTextFromImage(MultipartFile file) throws Exception {
        ByteString imgBytes;
        try (InputStream in = file.getInputStream()) {
            imgBytes = ByteString.readFrom(in);
        }

        if (imgBytes == null || imgBytes.isEmpty()) {
            System.out.println("이미지 바이트가 비어 있습니다. 건너뜁니다.");
            return "";
        }

        Image img = Image.newBuilder().setContent(imgBytes).build();
        Feature feat = Feature.newBuilder().setType(Feature.Type.TEXT_DETECTION).build();

        AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                .addFeatures(feat)
                .setImage(img)
                .build();

        List<AnnotateImageRequest> requests = new ArrayList<>();
        requests.add(request);

        try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
            BatchAnnotateImagesResponse response = client.batchAnnotateImages(requests);
            for (AnnotateImageResponse res : response.getResponsesList()) {
                if (res.hasError()) {
                    System.out.printf("Vision API Error: %s%n", res.getError().getMessage());
                    return "Error: " + res.getError().getMessage();
                } else {
                    return res.getFullTextAnnotation().getText();
                }
            }
        }
        return "";
    }

    private String extractTextFromPdf(MultipartFile file) throws IOException {
        PDDocument document = PDDocument.load(file.getInputStream());
        PDFTextStripper stripper = new PDFTextStripper();
        String text = stripper.getText(document);
        document.close();
        return text;
    }

    public SaAttachVO getAttachByUid(int sa_att_uid) {
        return saAttachDao.getAttachByUid(sa_att_uid);
    }
}

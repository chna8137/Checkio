package kr.co.ictedu.checkio.service;

import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

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

//	public String extractTextFromImageUrl(String imageUrl) throws Exception {
//		URL url = new URL(imageUrl);
//		ByteString imgBytes;
//		try (InputStream in = url.openStream()) {
//			imgBytes = ByteString.readFrom(in);
//		}
//
//		Image img = Image.newBuilder().setContent(imgBytes).build();
//		Feature feat = Feature.newBuilder().setType(Feature.Type.TEXT_DETECTION).build();
//		AnnotateImageRequest request = AnnotateImageRequest.newBuilder().addFeatures(feat).setImage(img).build();
//		List<AnnotateImageRequest> requests = new ArrayList<>();
//		requests.add(request);
//
//		try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
//			BatchAnnotateImagesResponse response = client.batchAnnotateImages(requests);
//			StringBuilder stringBuilder = new StringBuilder();
//			for (AnnotateImageResponse res : response.getResponsesList()) {
//				if (res.hasError()) {
//					System.out.printf("Error: %s\n", res.getError().getMessage());
//					return "Error detected";
//				}
//				stringBuilder.append(res.getFullTextAnnotation().getText());
//			}
//			return stringBuilder.toString();
//		}
//	}
	
//	public List<String> extractTextFromMultipartFiles(MultipartFile[] files) throws Exception {
//		
//		// OCR 결과(텍스트)를 저장할 리스트 생성
//	    List<String> resultList = new ArrayList<>();
//
//	    // 업로드된 모든 파일에 대해 반복
//	    for (MultipartFile file : files) {
//	        ByteString imgBytes; // // Vision API에서 요구하는 이미지 바이트 형식
//	        
//	        // 업로드된 파일에서 InputStream을 얻어서, ByteString으로 읽어오기
//	        try (InputStream in = file.getInputStream()) {
//	            imgBytes = ByteString.readFrom(in); // 이미지 데이터를 Google이 읽을 수 있는 형식으로 변환
//	        }
//
//	        // Vision API에 보낼 이미지 객체 생성
//	        Image img = Image.newBuilder().setContent(imgBytes).build();
//	        // 사용할 기능 정의
//	        Feature feat = Feature.newBuilder().setType(Feature.Type.TEXT_DETECTION).build();
//	        // 위에서 만든 이미지와 기능을 조합해서 하나의 요청(Request) 생성
//	        AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
//	                .addFeatures(feat)
//	                .setImage(img)
//	                .build();
//
//	        // 요청을 리스트로 감쌈 (Vision API는 여러 요청도 한 번에 처리 가능하므로 리스트 형태 요구)
//	        List<AnnotateImageRequest> requests = new ArrayList<>();
//	        requests.add(request);
//
//	        // Vision API 클라이언트 생성 (자동으로 연결 및 인증 처리)
//	        try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
//	        	// 클라이언트를 통해 실제 Vision API로 요청 보내기
//	            BatchAnnotateImagesResponse response = client.batchAnnotateImages(requests);
//	            for (AnnotateImageResponse res : response.getResponsesList()) {
//	            	// 에러가 있을 경우 에러 메시지 출력하고, 리스트에 오류 표시 추가
//	                if (res.hasError()) {
//	                    System.out.printf("Error: %s\n", res.getError().getMessage());
//	                    // 오류 발생 시 임시 문자열 넣음
//	                    resultList.add("Error detected");
//	                } else {
//	                	// 에러 없으면 추출된 텍스트 전체를 리스트에 추가
//	                    resultList.add(res.getFullTextAnnotation().getText());
//	                }
//	            }
//	        }
//	    }
//	    // 모든 이미지에 대한 텍스트 추출 완료 → 결과 리스트 반환
//	    return resultList;
//	}
	
	public List<String> extractTextFromMultipartFiles(MultipartFile[] files) throws Exception {

	    // OCR 결과(텍스트)를 저장할 리스트 생성
	    List<String> resultList = new ArrayList<>();

	    if (files == null || files.length == 0) {
	        System.out.println("입력된 파일이 없습니다.");
	        return resultList; // 빈 리스트 반환
	    }

	    // 업로드된 모든 파일에 대해 반복
	    for (MultipartFile file : files) {

	        // 파일이 null이거나 비어 있으면 건너뜀
	        if (file == null || file.isEmpty()) {
	            System.out.println("빈 파일이거나 null입니다. 건너뜁니다.");
	            continue;
	        }

	        ByteString imgBytes;

	        // 업로드된 파일에서 InputStream을 얻어서 ByteString으로 변환
	        try (InputStream in = file.getInputStream()) {
	            imgBytes = ByteString.readFrom(in);
	        }

	        // ByteString이 비어 있을 경우 건너뜀
	        if (imgBytes == null || imgBytes.isEmpty()) {
	            System.out.println("이미지 바이트가 비어 있습니다. 건너뜁니다.");
	            continue;
	        }

	        // Vision API에 보낼 이미지 객체 생성
	        Image img = Image.newBuilder().setContent(imgBytes).build();

	        // 사용할 기능 정의 (여기선 TEXT_DETECTION)
	        Feature feat = Feature.newBuilder()
	                .setType(Feature.Type.TEXT_DETECTION)
	                .build();

	        // 이미지와 기능을 조합해서 하나의 요청 생성
	        AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
	                .addFeatures(feat)
	                .setImage(img)
	                .build();

	        // 요청을 리스트로 감쌈
	        List<AnnotateImageRequest> requests = new ArrayList<>();
	        requests.add(request);

	        // Vision API 클라이언트 생성 및 요청 전송
	        try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
	            BatchAnnotateImagesResponse response = client.batchAnnotateImages(requests);
	            for (AnnotateImageResponse res : response.getResponsesList()) {
	                if (res.hasError()) {
	                    System.out.printf("Vision API Error: %s\n", res.getError().getMessage());
	                    resultList.add("Error: " + res.getError().getMessage()); // 오류 메시지를 그대로 저장
	                } else {
	                    String extractedText = res.getFullTextAnnotation().getText();
	                    if (extractedText == null || extractedText.trim().isEmpty()) {
	                        resultList.add("텍스트 없음");
	                    } else {
	                        resultList.add(extractedText);
	                    }
	                }
	            }
	        } catch (Exception e) {
	            e.printStackTrace();
	            resultList.add("OCR 처리 중 예외 발생: " + e.getMessage());
	        }
	    }

	    return resultList;
	}

}

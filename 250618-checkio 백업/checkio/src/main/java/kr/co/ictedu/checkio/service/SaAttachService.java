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
	
	public List<String> extractTextFromMultipartFiles(MultipartFile[] files) throws Exception {
	    List<String> resultList = new ArrayList<>();

	    for (MultipartFile file : files) {
	        ByteString imgBytes;
	        try (InputStream in = file.getInputStream()) {
	            imgBytes = ByteString.readFrom(in);
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
	                    System.out.printf("Error: %s\n", res.getError().getMessage());
	                    resultList.add("Error detected");
	                } else {
	                    resultList.add(res.getFullTextAnnotation().getText());
	                }
	            }
	        }
	    }

	    return resultList;
	}



}

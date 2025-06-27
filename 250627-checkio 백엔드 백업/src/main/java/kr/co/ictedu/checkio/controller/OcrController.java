package kr.co.ictedu.checkio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.ictedu.checkio.service.SaAttachService;

@RestController
public class OcrController {

//	@Autowired
//	private SaAttachService saAttachService;
//	
//	@GetMapping("/ocr")
//	public String ocr(@RequestParam("imageUrl") String imageUrl) {
//		try {
//			String imgText = saAttachService.extractTextFromImageUrl(imageUrl);
//			System.out.println(imgText.contains("자격"));
//			return saAttachService.extractTextFromImageUrl(imageUrl);
//			
//		} catch (Exception e) {
//			return "Failed to extract text : " + e.getMessage();
//		}
//	}
}

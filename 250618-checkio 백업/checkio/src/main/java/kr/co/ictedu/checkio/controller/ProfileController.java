package kr.co.ictedu.checkio.controller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpSession;
import kr.co.ictedu.checkio.CheckioApplication;
import kr.co.ictedu.checkio.service.ProfileService;
import kr.co.ictedu.checkio.service.SaAttachService; // 이 클래스는 현재 코드에서 사용되지 않는 것 같습니다.
import kr.co.ictedu.checkio.vo.SaAttachVO;
import kr.co.ictedu.checkio.vo.SawonVO;

@RestController
@RequestMapping("/profile")
public class ProfileController {

	private final CheckioApplication checkioApplication;

	@Autowired
	private ProfileService profileService;

	@Autowired // 이 어노테이션도 현재 코드에서 saAttachService가 사용되지 않아 불필요해 보입니다.
	private SaAttachService saAttachService;

	@Value("${spring.servlet.multipart.location}")
	private String uploadDir;

	ProfileController(CheckioApplication checkioApplication) {
		this.checkioApplication = checkioApplication;
	}

	@GetMapping("/detail")
	public List<SawonVO> detail() {
		System.out.println("제대로 실행이 될까?");
		return profileService.profile();
	}

//	@GetMapping("/ocr")
//	public String ocr(@RequestParam("imageUrl") MultipartFile[] imageUrl) {
//		try {
//			String imgText = saAttachService.extractTextFromMultipartFiles(imageUrl);
//			System.out.println(imgText.contains("자격"));
//			return saAttachService.extractTextFromMultipartFiles(imageUrl);
//			
//		} catch (Exception e) {
//			return "Failed to extract text : " + e.getMessage();
//		}
//	}

	@PostMapping("/update")
	public ResponseEntity<?> profileUpdate(@RequestParam("images") MultipartFile[] images, @ModelAttribute SawonVO vo)
			throws Exception {

		String[] Certificate = { "자격증", "자격", "취득", "합격", "발급", "certificate", "certification", "license", "qualified",
				"pass" };

		System.out.println("profileImage : " + vo.getProfileImage());
		System.out.println("telNo : " + vo.getTel_no());
		System.out.println("email : " + vo.getEmail());

		// SawonVO 정보 업데이트
		profileService.updateProfile(vo);

		// 1. OCR 수행
		List<String> imgText = saAttachService.extractTextFromMultipartFiles(images);

		// 2. 자격 키워드 검증
		boolean found = false;
		for (String e : imgText) {
			for (String keyword : Certificate) {
				if (e.toLowerCase().contains(keyword)) {
					found = true;
					break;
				}
			}
			if (found)
				break;
		}
		// 3. 실패 시 즉시 응답
		if (!found) {
			return ResponseEntity.badRequest().body("자격증 관련 문구가 포함된 파일만 업로드할 수 있습니다.");
		}

		// 4. 통과 시 파일 저장 및 DB 처리
		List<SaAttachVO> imageList = new ArrayList<>();
		try {
			for (MultipartFile file : images) {
				if (!file.isEmpty()) {
					String originalFilename = file.getOriginalFilename();
					System.out.println("originalFilename : " + originalFilename);
					File f = new File(uploadDir + "/", originalFilename);
					file.transferTo(f);

					SaAttachVO imageVO = new SaAttachVO();
					imageVO.setSa_file_name(originalFilename);
					imageVO.setSa_file_path(originalFilename);
					imageVO.setSa_source_id(vo.getSa_uid());
					imageVO.setSa_reg_id(vo.getUser_id());
					imageVO.setSa_reg_date(vo.getReg_date());
					imageVO.setSa_mod_id(vo.getMod_id());
					imageVO.setSa_mod_date(vo.getMod_date());

					imageList.add(imageVO);
				}
			}
			profileService.transcationProcess(imageList);
			return ResponseEntity.ok("자격증 등록 성공!");
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("업로드 실패");
		}
	}

}
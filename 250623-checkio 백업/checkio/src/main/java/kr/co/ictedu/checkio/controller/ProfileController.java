package kr.co.ictedu.checkio.controller;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
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
import kr.co.ictedu.checkio.vo.ProfileVO;
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
	public ProfileVO detail(HttpSession session) {

		session.setAttribute("sa_uid", 51);

		int sa_uid = (int) session.getAttribute("sa_uid");
		return profileService.getProfile(sa_uid);
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
	public ResponseEntity<?> profileUpdate(@RequestParam(value = "images", required = false) MultipartFile[] images,
			@ModelAttribute SawonVO vo) throws Exception {

		// 프로필 이미지가 있으면 저장 처리
		MultipartFile mf = vo.getMfile();
		if (mf != null && !mf.isEmpty()) {
			String oriFn = mf.getOriginalFilename();
			String fullPath = uploadDir + "\\profile\\" + oriFn;
			String savePath = "profile\\" + oriFn;
			System.out.println("oriFn : " + oriFn);
			System.out.println("fullpath : " + fullPath);
			File fi = new File(fullPath);
			mf.transferTo(fi);
			vo.setProfileImage(savePath);
		}

		// Sawon 정보 수정
		profileService.updateProfile(vo);

		// 자격증 파일이 있으면 OCR 검사 및 저장
		if (images != null && images.length > 0 && !images[0].isEmpty()) {
			try {
				List<String> certificateKeywords = Arrays.asList("자격증", "자격", "취득", "합격", "발급", "certificate",
						"certification", "license", "qualified", "pass");

				List<String> imgText = saAttachService.extractTextFromMultipartFiles(images);

				boolean foundCertificate = imgText.stream().map(String::toLowerCase)
						.anyMatch(text -> certificateKeywords.stream().anyMatch(text::contains));

				if (!foundCertificate) {
					return ResponseEntity.badRequest().body("자격증 파일만 업로드해주세요.");
				}

				// 자격증 파일 저장
				List<SaAttachVO> imageList = new ArrayList<>();
				for (MultipartFile file : images) {
					if (!file.isEmpty()) {
						String originalFilename = file.getOriginalFilename();
						String dateDir = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
						String fullPath = uploadDir + "\\profile\\" + dateDir + "\\" + originalFilename;
						String savePath = "profile\\" + dateDir + "\\" + originalFilename;
						System.out.println("fullPath : " + fullPath);

						File dir = new File(uploadDir + "\\profile\\" + dateDir);
						if (!dir.exists())
							dir.mkdirs();

						File f = new File(fullPath);
						file.transferTo(f);

						SaAttachVO imageVO = new SaAttachVO();
						imageVO.setSa_file_name(originalFilename);
						imageVO.setSa_file_path(savePath);
						imageVO.setSa_source_id(vo.getSa_uid());
						imageVO.setSa_reg_id(vo.getUser_id());
						imageVO.setSa_reg_date(vo.getReg_date());
						imageVO.setSa_mod_id(vo.getMod_id());
						imageVO.setSa_mod_date(vo.getMod_date());

						imageList.add(imageVO);
					}
				}

				profileService.transcationProcess(imageList);

			} catch (Exception e) {
				e.printStackTrace(); // 로깅
				// 실패했지만 전체 흐름은 계속 진행
			}
		}

		return ResponseEntity.ok("수정 완료");
	}

}
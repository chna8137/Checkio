package kr.co.ictedu.checkio.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import kr.co.ictedu.checkio.service.SawonService;
import kr.co.ictedu.checkio.vo.SawonVO;

@RestController
@RequestMapping("/api/sawon")
public class SawonController {

	@Autowired
	private SawonService sawonService;

	// 회원가입 API
	@PostMapping("/signup")
	public ResponseEntity<?> signup(@RequestBody SawonVO vo) {
		int result = sawonService.create(vo);
		if (result > 0) {
			return ResponseEntity.ok(Map.of("success", true));
		} else {
			return ResponseEntity.status(400).body(Map.of("success", false, "message", "회원가입 실패"));
		}
	}

	// 아이디 중복 확인 API
	@GetMapping("/check/{userId}")
	public ResponseEntity<?> check(@PathVariable("userId") String userId) {
		boolean exists = (sawonService.findByUserId(userId) != null);
		return ResponseEntity.ok(Map.of("available", !exists));
	}

	// 로그인 API
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Map<String, String> loginForm) {
		String userId = loginForm.get("user_id");
		String password = loginForm.get("password");

		SawonVO user = sawonService.login(userId, password);
		if (user != null) {
			return ResponseEntity.ok(Map.of("success", true, "message", "로그인 성공", "user", user));
		} else {
			return ResponseEntity.status(401).body(Map.of("success", false, "message", "아이디 또는 비밀번호가 올바르지 않습니다."));
		}
	}
	
	@PostMapping("/logout")
	public ResponseEntity<?> logout(HttpSession session) {
	    session.invalidate();  // 세션 무효화
	    return ResponseEntity.ok(Map.of("success", true));
	}

	// 사원 정보 수정 API - 인사과
	@PutMapping("/{saUid}")
	public ResponseEntity<?> update(@PathVariable int saUid, @RequestBody SawonVO vo, Principal principal) {
		vo.setSa_uid(saUid);
		String currentUser = (principal != null) ? principal.getName() : "unknown";
		int updated = sawonService.updateByHr(vo, currentUser);
		return ResponseEntity.ok(Map.of("updated", updated));
	}
}
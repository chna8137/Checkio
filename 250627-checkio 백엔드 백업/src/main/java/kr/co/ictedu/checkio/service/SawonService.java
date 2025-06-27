package kr.co.ictedu.checkio.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.ictedu.checkio.dao.SawonDao;
import kr.co.ictedu.checkio.vo.SawonVO;

@Service
public class SawonService {
	@Autowired
	private SawonDao sawonDao;
	@Autowired
	private BCryptPasswordEncoder pwEncoder;

//	회원가입
	@Transactional
	public int create(SawonVO vo) {
//    vo.setPassword(pwEncoder.encode(vo.getPassword())); // 비밀번호 암호화
		Integer defaultAuthUid = sawonDao.findAuthUidByLevel(0);
		Integer defaultDeptNo = sawonDao.findDeptNoByName("미배정");

		if (defaultAuthUid == null || defaultDeptNo == null) {
			throw new IllegalStateException("기본 권한 또는 부서 정보가 누락되었습니다.");
		}
		vo.setAuth_uid(defaultAuthUid);
		vo.setDept_no(defaultDeptNo);
		return sawonDao.insertSawon(vo);
	}
	
//	단일 조회: user_id
	public SawonVO findByUserId(String userId) {
		return sawonDao.selectByUserId(userId);
	}

//	권한 레벨 조회
	public int getAuthLevel(String userId) {
		Integer level = null;
		try {
			level = sawonDao.selectAuthLevelByUserId(userId);
		} catch (Exception e) {
			// 예외 상황 처리 (없는 사용자 등)
			level = 0;
		}
		return level != null ? level : 0;
	}

//	사원 정보 수정 (인사과 등)
	@Transactional
	public int updateByHr(SawonVO vo, String currentUserId) {
		int myLevel = getAuthLevel(currentUserId);

		if (myLevel < 2) {
			vo.setDept_no(myLevel); // 레벨 낮으면 강제 제한
		}
		vo.setMod_id(currentUserId);
		return sawonDao.updateSawon(vo);
	}

//	로그인 처리 (암호화X)
	public SawonVO login(String userId, String rawPassword) {
		SawonVO user = sawonDao.selectByUserId(userId);
		if (user != null && rawPassword.equals(user.getPassword())) {
			return user;
		}
		return null; // 로그인 실패
	}
}

//	로그인 처리 (암호화O)
//  public SawonVO login(String userId, String rawPassword) {
//    SawonVO user = sawonDao.selectByUserId(userId);
//    if (user != null && pwEncoder.matches(rawPassword, user.getPassword())) {
//      return user;
//    }
//    return null; // 로그인 실패
//  }
//}

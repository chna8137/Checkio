package kr.co.ictedu.checkio.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import kr.co.ictedu.checkio.vo.SawonVO;

@Mapper
public interface SawonDao {

//  사원 신규 등록
	int insertSawon(SawonVO vo);

//  인사과에서 사원 정보 수정
	int updateSawon(SawonVO vo);

//  로그인 및 중복 체크, user_id 기준 조회
	SawonVO selectByUserId(String userId);

//  권한 레벨 조회, user_id 기준 auth_level 반환
	int selectAuthLevelByUserId(String userId);

//	사원 상세 조회, sa_uid 기준
	SawonVO selectBySaUid(int saUid);

//	로그인 처리, user_id + password
	SawonVO login(@Param("user_id") String user_id, @Param("password") String password);

	int findAuthUidByLevel(int level);

	int findDeptNoByName(String deptName);
}
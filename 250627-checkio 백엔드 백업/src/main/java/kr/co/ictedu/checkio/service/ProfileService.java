package kr.co.ictedu.checkio.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.ictedu.checkio.dao.ProfileDao;
import kr.co.ictedu.checkio.vo.ProfileVO;
import kr.co.ictedu.checkio.vo.SaAttachVO;
import kr.co.ictedu.checkio.vo.SawonVO;

@Service
public class ProfileService {

	@Autowired
	private ProfileDao profileDao;

//	public SawonVO profile() {
//
//		return profileDao.profile();
//	}
//	
//	public List<SaAttachVO> list() {
//		return profileDao.list();
//	}
	
	public ProfileVO getProfile(int sa_uid) {
		SawonVO profile = profileDao.profile(sa_uid);
		List<SaAttachVO> list = profileDao.list(sa_uid);
		
		ProfileVO vo = new ProfileVO();
		vo.setProfile(profile);
		vo.setFileList(list);
		return vo;
	}

	public void updateProfile(SawonVO vo) {
		profileDao.updateProfile(vo);
	}
	
	public void transcationProcess(List<SaAttachVO> savoList) {
		profileDao.addImg(savoList);
	}
	
	public void deleteProfile(int sa_att_uid) {
		profileDao.deleteProfile(sa_att_uid);
	}
	
	

}

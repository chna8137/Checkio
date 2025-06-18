package kr.co.ictedu.checkio.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.ictedu.checkio.dao.ProfileDao;
import kr.co.ictedu.checkio.vo.SaAttachVO;
import kr.co.ictedu.checkio.vo.SawonVO;

@Service
public class ProfileService {

	@Autowired
	private ProfileDao profileDao;

	public List<SawonVO> profile() {

		return profileDao.profile();
	}

	public void updateProfile(SawonVO vo) {
		profileDao.updateProfile(vo);
	}
	
	public void transcationProcess(List<SaAttachVO> savoList) {
		profileDao.addImg(savoList);
	}

}

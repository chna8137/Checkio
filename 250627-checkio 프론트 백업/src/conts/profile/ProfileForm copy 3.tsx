import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './profile.module.css';
import axios from 'axios';

interface ProfileResponse {
  fileList: SaAttachVO[];
  profile: ProfileVO;
}

interface ProfileVO {
  sa_uid?: number;
  profileImage?: string;
  user_name?: string;
  dept_name?: string;
  tel_no: string;
  email: string;
  position?: string;
  join_date?: string;
  mfile?: File | null;
  certFiles?: File[];
}

interface SaAttachVO {
  sa_att_uid?: number;
  sa_file_name?: string;
  sa_file_path?: string;
}

const ProfileForm: React.FC = () => {
  const [profile, setProfile] = useState<ProfileVO | null>(null);
  const [imgList, setImgList] = useState<SaAttachVO[]>([]);
  const [formData, setFormData] = useState<ProfileVO>({
    tel_no: '',
    email: '',
    mfile: null,
    certFiles: [],
  });
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string>('/images/profile.jpg');
  const [certificatePreviewUrls, setCertificatePreviewUrls] = useState<string[]>([]);

  const imageBasePath = `http://192.168.56.1/checkio/upload/`;
  const fileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const resp = await axios.get<ProfileResponse>('http://192.168.56.1/checkio/profile/detail');
      const { profile, fileList } = resp.data;

      setProfile(profile);
      setImgList(fileList);
      setFormData({
        tel_no: profile.tel_no,
        email: profile.email,
        mfile: null,
        certFiles: [],
      });

      if (profile.profileImage) {
        setProfilePreviewUrl(`${imageBasePath}${profile.profileImage}`);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
      // allowed에서 하나라도 특정 조건을 만족하는지 확인
      const isValid = allowed.some(item => file.name.toLowerCase().endsWith(item));
      if (!isValid) {
        alert('프로필 이미지는 이미지 파일만 업로드 가능합니다.');
        e.target.value = '';
        return;
      }
      setFormData(prev => ({ ...prev, mfile: file }));

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2 && typeof reader.result === 'string') {
          setProfilePreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, mfile: null }));
      setProfilePreviewUrl('/images/profile.jpg');
    }
  };

  const handleCertificateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.pdf'];

    // 유효성 검사
    const allValid = files.every(file =>
      allowed.some(ext => file.name.toLowerCase().endsWith(ext))
    );

    if (!allValid) {
      alert('이미지 또는 PDF 파일만 업로드 가능합니다.');
      e.target.value = ''; // 파일 초기화
      return;
    }
    const urls = files.map(file =>
      file.type.startsWith('image/') ? URL.createObjectURL(file) : file.name
    );

    setCertificatePreviewUrls(urls);
    setFormData(prev => ({ ...prev, certFiles: files }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedProfile = new FormData();
    updatedProfile.append('tel_no', formData.tel_no);
    updatedProfile.append('email', formData.email);

    if (formData.mfile) {
      updatedProfile.append('mfile', formData.mfile);
    } else if (profile?.profileImage) {
      updatedProfile.append('profileImage', profile.profileImage); // 경로만 전달
    }

    formData.certFiles?.forEach(file => updatedProfile.append('images', file));

    try {
      await axios.post('http://192.168.56.1/checkio/profile/update', updatedProfile, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('프로필이 성공적으로 업데이트되었습니다!');
      navigate('/profile');
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data)
      } else {
        console.error('프로필 업데이트 중 오류:', error);
        alert('프로필 업데이트 실패. 다시 시도해 주세요.');
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>프로필 정보</h2>

      <div className={styles.avatarSection}>
        <img src={profilePreviewUrl} className={styles.avatar} alt="프로필 미리보기" onClick={() => { fileInput.current?.click() }} style={{ cursor: 'pointer' }} />
        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfileFileChange} ref={fileInput} />
      </div>

      <label className={styles.field}>
        이름
        <input type="text" value={profile?.user_name || ''} disabled className={styles.input} />
      </label>

      <label className={styles.field}>
        부서
        <input type="text" value={profile?.dept_name || ''} disabled className={styles.input} />
      </label>

      <label className={styles.field}>
        전화번호
        <input type="tel" name="tel_no" value={formData.tel_no} onChange={handleChange} className={styles.input} />
      </label>

      <label className={styles.field}>
        이메일
        <input type="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} />
      </label>

      <label className={styles.field}>
        직무/직급
        <input type="text" value={profile?.position || ''} disabled className={styles.input} />
      </label>

      <label className={styles.field}>
        입사일
        <input type="date" value={profile?.join_date?.split(' ')[0] || ''} disabled className={styles.input} />
      </label>

      {/* <label className={styles.field}>
        자격증 업로드
        {certificatePreviewUrls.map((url, idx) =>
          url.endsWith('.pdf') ? <p key={idx}>{url}</p> : <img key={idx} src={url} className={styles.avatar} alt="자격증 미리보기" />
        )}
        <input type="file" accept="image/*, .pdf" multiple className={styles.fileInput} onChange={handleCertificateFileChange} />
        {imgList.map(item => (
          <div key={item.sa_att_uid}>
            <img src={`${imageBasePath}${item.sa_file_path}`} alt="기존 자격증" />
          </div>
        ))}
      </label> */}
      {/* <DragDrop/> */}

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.button}>저장</button>
        <Link to="/profile/">
          <button type="button" className={styles.cancelButton}>취소</button>
        </Link>
      </div>
    </form>
  );
};

export default ProfileForm;

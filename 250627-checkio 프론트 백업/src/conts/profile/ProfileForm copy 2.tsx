import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  mfile?: File | null;  // 프로필 이미지 파일
  certFiles?: File[];   // 자격증 파일들
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

  useEffect(() => {
    const detail = async () => {
      const resp = await axios.get<ProfileResponse>('http://192.168.56.1/checkio/profile/detail');
      setProfile(resp.data.profile);
      setImgList(resp.data.fileList);

      setFormData({
        tel_no: resp.data.profile.tel_no,
        email: resp.data.profile.email,
        mfile: null,
        certFiles: [],
      });

      if (resp.data.profile.profileImage) {
        setProfilePreviewUrl(`${imageBasePath}${resp.data.profile.profileImage}`);
      }
    };

    detail();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("file : ", file);
    if (file) {
      const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
      const isValid = allowed.some(ext => file.name.toLowerCase().endsWith(ext));
      if (!isValid) {
        alert('프로필 이미지는 이미지 파일만 업로드 가능합니다!');
        e.target.value = '';
        return;
      }

      setProfilePreviewUrl(URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        mfile: file,
      }));
    }
  };

  const handleCertificateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map(file =>
      file.type.startsWith('image/') ? URL.createObjectURL(file) : file.name
    );

    setCertificatePreviewUrls(urls);
    setFormData(prev => ({
      ...prev,
      certFiles: files,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedProfile = new FormData();
    updatedProfile.append('tel_no', formData.tel_no);
    updatedProfile.append('email', formData.email);

    if (formData.mfile) {
      updatedProfile.append('profileImage', formData.mfile);
    } else if (profile?.profileImage) {
      updatedProfile.append('profileImage', profile.profileImage);  // 기존 경로 전송
    }

    if (formData.certFiles && formData.certFiles.length > 0) {
      formData.certFiles.forEach(file => updatedProfile.append('images', file));
    }

    try {
      await axios.post('http://192.168.56.1/checkio/profile/update', updatedProfile);
      alert('프로필이 성공적으로 업데이트되었습니다!');
    } catch (error) {
      console.error('프로필 업데이트 중 오류:', error);
      alert('프로필 업데이트 실패. 다시 시도해 주세요.');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>프로필 정보</h2>

      <div className={styles.avatarSection}>
        <img src={profilePreviewUrl} className={styles.avatar} alt="프로필 미리보기" />
        <label className={styles.fileLabel}>
          프로필 사진 수정
          <input type="file" accept="image/*" className={styles.fileInput} onChange={handleProfileFileChange} />
        </label>
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
        <input type="date" value={profile?.join_date ? profile.join_date.split(' ')[0] : ''} disabled className={styles.input} />
      </label>

      <label className={styles.field}>
        자격증 업로드
        {certificatePreviewUrls.map((url, idx) =>
          url.endsWith('.pdf') ? <p key={idx}>{url}</p> : <img key={idx} src={url} className={styles.avatar} alt="자격증 미리보기" />
        )}
        <input type="file" accept="image/*, .pdf" multiple className={styles.fileInput} onChange={handleCertificateFileChange} />
        {imgList.map((item) => (
          <div key={item.sa_att_uid}>
            <img src={`${imageBasePath}${item.sa_file_path}`} alt="기존 자격증" />
          </div>
        ))}
      </label>

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

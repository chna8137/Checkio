import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './profile.module.css';
import axios from 'axios';
import DragDropFile from './DragDropFile';
import Swal from 'sweetalert2';

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
  const [formData, setFormData] = useState<ProfileVO>({
    tel_no: '',
    email: '',
    mfile: null,
    certFiles: [],
  });
  const [oldFiles, setOldFiles] = useState<SaAttachVO[]>([]);  // 기존 파일 상태
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string>('/images/profile.jpg');

  const imageBasePath = `http://192.168.56.1/checkio/upload/`;
  const fileInput = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const resp = await axios.get<ProfileResponse>('http://192.168.56.1/checkio/profile/detail');
      const { profile, fileList } = resp.data;
      setProfile(profile);
      setOldFiles(fileList); // 기존 파일을 저장
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

  const handleRemoveNewFile = (index: number) => {
    
    setFormData(prev => {
      const updated = [...(prev.certFiles || [])];
      updated.splice(index, 1);
      return { ...prev, certFiles: updated };
    });
  };

  // const handleRemoveOldFile = async (sa_att_uid?: number) => {

  //   if(!sa_att_uid) return;

  //   try {
  //     await axios.post(`http://192.168.56.1/checkio/profile/delete?num=${sa_att_uid}`);
  //     alert("삭제되었습니다");
  //     setOldFiles(prev => prev.filter(file => file.sa_att_uid !== sa_att_uid));
  //   } catch (error) {
  //     console.error("삭제 중 문제가 발생했습니다." , error);
  //     alert('삭제 실패');
      
  //   }
    
  // };

const handleRemoveOldFile = async (sa_att_uid?: number) => {
  if (!sa_att_uid) return;

  const result = await Swal.fire({
    title: '정말 삭제하시겠습니까?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '삭제',
    cancelButtonText: '취소'
  });

  if (result.isConfirmed) {
    try {
      await axios.post(`http://192.168.56.1/checkio/profile/delete?num=${sa_att_uid}`);
      
      Swal.fire('삭제 완료', '파일이 삭제되었습니다.', 'success');

      setOldFiles(prev => prev.filter(file => file.sa_att_uid !== sa_att_uid));
    } catch (error) {
      console.error("삭제 중 문제가 발생했습니다.", error);
      Swal.fire('삭제 실패', '삭제 중 문제가 발생했습니다. 다시 시도해주세요.', 'error');
    }
  }
};


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedProfile = new FormData();
    updatedProfile.append('tel_no', formData.tel_no);
    updatedProfile.append('email', formData.email);
    if (formData.mfile) {
      updatedProfile.append('mfile', formData.mfile);
    } else if (profile?.profileImage) {
      updatedProfile.append('profileImage', profile.profileImage);
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
        alert(error.response.data);
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
        <img
          src={profilePreviewUrl}
          className={styles.avatar}
          alt="프로필 미리보기"
          onClick={() => { fileInput.current?.click() }}
          style={{ cursor: 'pointer' }}
        />
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

      <label className={styles.field}>
        자격증 파일

        {/* 기존 자격증 파일 */}
        {oldFiles.map((file) => (
          <div key={file.sa_att_uid} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <a href={`${imageBasePath}${file.sa_file_path}`} target="_blank" rel="noreferrer">
              {file.sa_file_name}
            </a>
            <button type="button" className={styles.button} onClick={() => handleRemoveOldFile(file.sa_att_uid)}>삭제</button>
          </div>
        ))}

        {/* 새로 추가된 자격증 파일 */}
        {formData.certFiles?.map((file, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{file.name}</span>
            <button type="button" onClick={() => handleRemoveNewFile(idx)}>삭제</button>
          </div>
        ))}
      </label>

      <DragDropFile onFilesChange={(files) => setFormData(prev => ({ ...prev, certFiles: files }))} />

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

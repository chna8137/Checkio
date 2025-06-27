import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './profile.module.css';
import axios from 'axios';

interface ProfileResponse {
  profile: ProfileVO;
}

interface ProfileVO {
  sa_uid?: number;
  sa_att_uid?: number;
  profileImage?: string;
  user_name?: string;
  dept_name?: string;
  tel_no: string;
  email: string;
  position?: string;
  join_date?: string;
  sa_file_name?: string;
  sa_file_path?: string;
  mfile?: File | null;
}

const ProfileForm: React.FC = () => {
  const [profile, setProfile] = useState<ProfileVO | null>(null);
  const [formData, setFormData] = useState<ProfileVO>({
    tel_no: '',
    email: '',
    mfile: null,
  });

  // useEffect(() => {
  //   const detail = async () => {
  //     const resp = await axios.get<ProfileResponse>(
  //       'http://192.168.56.1/checkio/profile/detail'
  //     );
  //     setProfile(resp.data.profile);
  //     setFormData({
  //       tel_no: resp.data.profile.tel_no,
  //       email: resp.data.profile.email,
  //       mfile: resp.data.profile.mfile,
  //     });
  //     console.log(resp.data);
  //   };
  //   detail();
  // }, []);
  const imageBasePath = `http://192.168.56.1/checkio/upload/`;

  useEffect(() => {
    const detail = async () => {
      const resp = await axios.get<ProfileResponse>(
        'http://192.168.56.1/checkio/profile/detail'
      );

      setProfile(resp.data.profile);
      setFormData({
        tel_no: resp.data.profile.tel_no,
        email: resp.data.profile.email,

        // mfile은 여기 필요 없음! 자격증 업로드 시 input에서 새로 담김
      });

      // 서버에서 받은 profileImage 경로를 미리보기 URL로 세팅
      if (resp.data.profile.profileImage) {
        // setPreviewUrl(resp.data.profile.profileImage);
        setPreviewUrl(imageBasePath);
      } else {
        setPreviewUrl('/images/profile.jpg'); // 기본 이미지
      }

      console.log(resp.data);
    };

    detail();
  }, []);


  const [previewUrl, setPreviewUrl] = useState<string>('/images/profile.jpg');

  // 전화번호, 이메일 값 변경을 처리하는 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(`${name}: ${value}`);
  };

  // 프로필 사진 파일 업로드 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData((prevState) => ({
        ...prevState,
        profileImageFile : file, // 파일 변경 시 formData에 파일 업데이트
      }));
    }
  };

  // 폼 제출 시 데이터 서버에 전송
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedProfile = new FormData();

    // 기존 프로필 데이터를 FormData에 추가
    updatedProfile.append('tel_no', formData.tel_no);
    updatedProfile.append('email', formData.email);

    if (formData.mfile) {
      updatedProfile.append('mfile', formData.mfile);
    }

    try {
      // 서버에 PUT 요청으로 프로필 정보 업데이트
      const response = await axios.post(
        'http://192.168.0.38/checkio/profile/update',
        updatedProfile
      );
      console.log(response.data); // 응답 데이터 확인
      alert('프로필이 성공적으로 업데이트되었습니다!');
    } catch (error) {
      console.error('프로필 업데이트 중 오류가 발생했습니다:', error);
      alert('프로필 업데이트 실패. 다시 시도해 주세요.');
    }
  };

  const handelFileAccept = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileName = file.name.toLowerCase();

      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.pdf'];

      const isValid = allowedExtensions.some(ext => fileName.endsWith(ext));

      if (!isValid) {
        alert('이미지 또는 PDF 파일만 업로드 가능합니다!');
        e.target.value = ''; // 파일 선택 취소
        return;
      }

      // 유효한 파일이면 추가 처리
      console.log('파일 통과:', file);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>프로필 정보</h2>

      <div className={styles.avatarSection}>
        <img src={`${previewUrl}${profile?.profileImage}`} className={styles.avatar} />
        <label className={styles.fileLabel}>
          프로필 사진 수정
          <input
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleFileChange}
          />
        </label>
      </div>

      <label className={styles.field}>
        이름
        <input
          type="text"
          name="name"
          value={profile?.user_name || ''}
          disabled
          className={styles.input}
        />
      </label>

      <label className={styles.field}>
        부서
        <input
          type="text"
          name="department"
          value={profile?.dept_name || ''}
          disabled
          className={styles.input}
        />
      </label>

      <label className={styles.field}>
        전화번호
        <input
          type="tel"
          name="tel_no"
          value={formData.tel_no}
          onChange={handleChange}
          className={styles.input}
        />
      </label>

      <label className={styles.field}>
        이메일
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
        />
      </label>

      <label className={styles.field}>
        직무/직급
        <input
          type="text"
          name="position"
          value={profile?.position || ''}
          disabled
          className={styles.input}
        />
      </label>

      <label className={styles.field}>
        입사일
        <input
          type="date"
          name="hireDate"
          value={profile?.join_date ? profile.join_date.split(' ')[0] : ''}
          disabled
          className={styles.input}
        />
      </label>

      <label className={styles.field}>
        자격증 업로드
        <input type="file" className={styles.fileInput} accept='image/*, .pdf' onChange={handelFileAccept} />
      </label>

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.button}>
          저장
        </button>
        <Link to="/profile/">
          <button type="button" className={styles.cancelButton}>
            취소
          </button>
        </Link>
      </div>
    </form>
  );
};

export default ProfileForm;

import React, { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const UserCreate = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    phone: '',
    level: 'BRONZE',
    initialPoints: '0',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 실시간 유효성 검사
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = '아이디를 입력하세요.';
    } else if (formData.username.length < 4) {
      newErrors.username = '아이디는 4자 이상이어야 합니다.';
    }

    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력하세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력하세요.';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력하세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력하세요.';
    } else if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '전화번호 형식이 올바르지 않습니다. (010-0000-0000)';
    }

    const initialPoints = parseInt(formData.initialPoints);
    if (isNaN(initialPoints) || initialPoints < 0) {
      newErrors.initialPoints = '초기 포인트는 0 이상의 숫자여야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // 여기서 API 호출
      console.log('회원 생성:', formData);
      alert('회원이 성공적으로 생성되었습니다.');
      // 성공 후 목록 페이지로 이동
      // navigate('/users/list');
    }
  };

  const InputField = ({ label, name, type = 'text', required = false, placeholder = '', options = null }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {options ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors[name] ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors[name] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      )}
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">회원 생성</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">새 회원 정보</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 계정 정보 */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
                계정 정보
              </h4>
              
              <InputField
                label="아이디"
                name="username"
                required
                placeholder="영문, 숫자 4자 이상"
              />

              <InputField
                label="비밀번호"
                name="password"
                type="password"
                required
                placeholder="6자 이상"
              />

              <InputField
                label="비밀번호 확인"
                name="confirmPassword"
                type="password"
                required
                placeholder="비밀번호 재입력"
              />

              <InputField
                label="회원 등급"
                name="level"
                options={[
                  { value: 'BRONZE', label: 'BRONZE' },
                  { value: 'SILVER', label: 'SILVER' },
                  { value: 'GOLD', label: 'GOLD' },
                  { value: 'VIP', label: 'VIP' }
                ]}
              />

              <InputField
                label="계정 상태"
                name="status"
                options={[
                  { value: 'active', label: '활성' },
                  { value: 'pending', label: '대기' },
                  { value: 'suspended', label: '정지' }
                ]}
              />
            </div>

            {/* 개인 정보 */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
                개인 정보
              </h4>

              <InputField
                label="이름"
                name="name"
                required
                placeholder="실명을 입력하세요"
              />

              <InputField
                label="이메일"
                name="email"
                type="email"
                required
                placeholder="example@domain.com"
              />

              <InputField
                label="전화번호"
                name="phone"
                required
                placeholder="010-0000-0000"
              />

              <InputField
                label="초기 포인트"
                name="initialPoints"
                type="number"
                placeholder="0"
              />
            </div>
          </div>

          {/* 폼 하단 버튼 */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              회원 생성
            </button>
          </div>
        </form>
      </div>

      {/* 회원 생성 가이드 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">회원 생성 가이드</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 아이디는 영문, 숫자 조합으로 4자 이상 입력해주세요.</li>
          <li>• 비밀번호는 6자 이상으로 설정해주세요.</li>
          <li>• 전화번호는 010-0000-0000 형식으로 입력해주세요.</li>
          <li>• 초기 포인트는 회원 가입 시 지급할 포인트입니다.</li>
          <li>• 생성된 회원은 즉시 시스템에 등록됩니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default UserCreate;
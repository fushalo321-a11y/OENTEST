import { useAuth } from '../contexts/AuthContext';

// 역할 정의
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  GUEST: 'guest'
};

// 권한 정의
export const PERMISSIONS = {
  // 사용자 관리
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_BAN: 'user:ban',
  USER_UNBAN: 'user:unban',
  
  // 게시글 관리
  POST_VIEW: 'post:view',
  POST_CREATE: 'post:create',
  POST_UPDATE: 'post:update',
  POST_DELETE: 'post:delete',
  POST_APPROVE: 'post:approve',
  POST_REJECT: 'post:reject',
  
  // 시스템 관리
  SYSTEM_VIEW: 'system:view',
  SYSTEM_UPDATE: 'system:update',
  SYSTEM_DELETE: 'system:delete',
  
  // 보안 관리
  SECURITY_VIEW: 'security:view',
  SECURITY_UPDATE: 'security:update',
  SECURITY_DELETE: 'security:delete',
  
  // 로그 관리
  LOG_VIEW: 'log:view',
  LOG_DELETE: 'log:delete',
  
  // 관리자 관리
  ADMIN_VIEW: 'admin:view',
  ADMIN_CREATE: 'admin:create',
  ADMIN_UPDATE: 'admin:update',
  ADMIN_DELETE: 'admin:delete',
  
  // 설정 관리
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_UPDATE: 'settings:update'
};

// 역할별 권한 매핑
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    // 모든 권한
    ...Object.values(PERMISSIONS)
  ],
  
  [ROLES.ADMIN]: [
    // 사용자 관리
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_BAN,
    PERMISSIONS.USER_UNBAN,
    
    // 게시글 관리
    PERMISSIONS.POST_VIEW,
    PERMISSIONS.POST_UPDATE,
    PERMISSIONS.POST_DELETE,
    PERMISSIONS.POST_APPROVE,
    PERMISSIONS.POST_REJECT,
    
    // 시스템 관리
    PERMISSIONS.SYSTEM_VIEW,
    PERMISSIONS.SYSTEM_UPDATE,
    
    // 보안 관리
    PERMISSIONS.SECURITY_VIEW,
    PERMISSIONS.SECURITY_UPDATE,
    
    // 로그 관리
    PERMISSIONS.LOG_VIEW,
    
    // 설정 관리
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_UPDATE
  ],
  
  [ROLES.MODERATOR]: [
    // 사용자 관리 (제한적)
    PERMISSIONS.USER_VIEW,
    
    // 게시글 관리
    PERMISSIONS.POST_VIEW,
    PERMISSIONS.POST_UPDATE,
    PERMISSIONS.POST_APPROVE,
    PERMISSIONS.POST_REJECT,
    
    // 시스템 관리 (제한적)
    PERMISSIONS.SYSTEM_VIEW,
    
    // 로그 관리 (제한적)
    PERMISSIONS.LOG_VIEW
  ],
  
  [ROLES.USER]: [
    // 기본 권한
    PERMISSIONS.POST_VIEW,
    PERMISSIONS.POST_CREATE
  ],
  
  [ROLES.GUEST]: [
    // 읽기 전용 권한
    PERMISSIONS.POST_VIEW
  ]
};

// 권한 검사 함수
export const hasPermission = (userRole, requiredPermission) => {
  if (!userRole || !requiredPermission) {
    return false;
  }
  
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  return userPermissions.includes(requiredPermission);
};

// 여러 권한 중 하나라도 있는지 검사
export const hasAnyPermission = (userRole, requiredPermissions) => {
  return requiredPermissions.some(permission => hasPermission(userRole, permission));
};

// 모든 권한이 있는지 검사
export const hasAllPermissions = (userRole, requiredPermissions) => {
  return requiredPermissions.every(permission => hasPermission(userRole, permission));
};

// 역할 기반 접근 제어 (RBAC) 컴포넌트
export const withPermission = (WrappedComponent, requiredPermission) => {
  return function PermissionWrapper(props) {
    const { user } = props;
    
    if (!user || !hasPermission(user.role, requiredPermission)) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-lg font-medium mb-2">
              접근 권한이 없습니다
            </div>
            <div className="text-gray-600">
              이 페이지에 접근할 수 있는 권한이 없습니다.
            </div>
          </div>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
};

// 권한 기반 라우트 보호
export const ProtectedRoute = ({ children, requiredPermission, fallback }) => {
  const { user } = useAuth();
  
  if (!user || !hasPermission(user.role, requiredPermission)) {
    return fallback || (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium mb-2">
            접근 권한이 없습니다
          </div>
          <div className="text-gray-600">
            이 페이지에 접근할 수 있는 권한이 없습니다.
          </div>
        </div>
      </div>
    );
  }
  
  return children;
};

// 권한 기반 메뉴 필터링
export const filterMenuByPermissions = (menuItems, userRole) => {
  return menuItems.filter(item => {
    if (item.permission) {
      return hasPermission(userRole, item.permission);
    }
    if (item.children) {
      const filteredChildren = filterMenuByPermissions(item.children, userRole);
      return filteredChildren.length > 0;
    }
    return true;
  });
};

// 민감한 데이터 필터링
export const filterSensitiveData = (data, userRole) => {
  if (!data) return data;
  
  const sensitiveFields = {
    [ROLES.USER]: ['password', 'mfaSecret', 'lastLoginIp', 'internalNotes'],
    [ROLES.MODERATOR]: ['password', 'mfaSecret', 'internalNotes'],
    [ROLES.ADMIN]: ['password', 'mfaSecret'],
    [ROLES.SUPER_ADMIN]: [] // 모든 데이터 접근 가능
  };
  
  const fieldsToRemove = sensitiveFields[userRole] || Object.values(sensitiveFields).flat();
  
  if (Array.isArray(data)) {
    return data.map(item => filterSensitiveData(item, userRole));
  }
  
  if (typeof data === 'object') {
    const filtered = { ...data };
    fieldsToRemove.forEach(field => {
      delete filtered[field];
    });
    return filtered;
  }
  
  return data;
};

// 권한 로깅
export const logPermissionAttempt = (userId, userRole, attemptedAction, success, details = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    userId,
    userRole,
    attemptedAction,
    success,
    details,
    ip: details.ip || 'unknown',
    userAgent: details.userAgent || 'unknown'
  };
  
  // 실제 구현에서는 서버로 로그를 전송
  console.log('Permission Log:', logEntry);
  
  // 실패한 권한 시도는 별도로 로깅
  if (!success) {
    console.warn('Unauthorized access attempt:', logEntry);
  }
}; 
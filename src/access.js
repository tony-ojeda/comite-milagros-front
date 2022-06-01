/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.role === 'admin',
    canAdminAndSecretary: currentUser && ['admin','secretary'].includes(currentUser.role),
    canSecretary: currentUser && currentUser.role === 'secretary',
    canCarrier: currentUser && currentUser.role === 'carrier',
  };
}

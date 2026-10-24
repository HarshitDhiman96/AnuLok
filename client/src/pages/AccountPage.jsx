import React from 'react';
import { useNavigate } from 'react-router-dom';
import AccountDrawer from '../components/common/AccountDrawer';

export default function AccountPage() {
  const navigate = useNavigate();

  return <AccountDrawer isOpen onClose={() => navigate('/')} />;
}

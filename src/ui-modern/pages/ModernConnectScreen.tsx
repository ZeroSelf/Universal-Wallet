import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { Account, WebsiteState } from '@/shared/types';
import { useI18n } from '@/ui/hooks/useI18n';
import { useCurrentAccount } from '@/ui/state/accounts/hooks';
import { useCurrentKeyring } from '@/ui/state/keyrings/hooks';
import { shortAddress, useApproval, useWallet } from '@/ui/utils';
import { formatSessionIcon } from '@/ui/utils';

import { ModernButton } from '../components/common/ModernButton';
import { ModernLoadingSpinner } from '../components/common/ModernLoadingSpinner';

interface ModernConnectScreenProps {
  params: {
    session: {
      origin: string;
      icon: string;
      name: string;
    };
  };
}

// Website Header Bar Component
const ModernWebsiteBar: React.FC<{ session: { origin: string; icon: string; name: string } }> = ({ session }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: '12px 20px',
        background: 'rgba(255, 255, 255, 0.06)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
      <img
        src={formatSessionIcon(session)}
        alt={session.name}
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '6px',
          objectFit: 'cover'
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#ffffff',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
          {session.name || session.origin}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginTop: '2px'
          }}>
          {session.origin}
        </div>
      </div>
    </motion.div>
  );
};

// Account Card Component
const ModernAccountCard: React.FC<{ account: Account; selected?: boolean }> = ({ account, selected }) => {
  if (!account) return null;

  return (
    <div
      style={{
        padding: '20px 24px',
        background: 'rgba(255, 255, 255, 0.06)',
        border: selected ? '1px solid var(--modern-accent-primary)' : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxSizing: 'border-box'
      }}>
      {selected && (
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'var(--modern-accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0, paddingTop: '2px', paddingBottom: '2px' }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '6px',
            lineHeight: '1.4',
            paddingTop: '1px'
          }}>
          {account.alianName}
        </div>
        <div
          style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.6)',
            fontFamily: 'monospace',
            wordBreak: 'break-all',
            lineHeight: '1.4'
          }}>
          {shortAddress(account.address, 20)}
        </div>
      </div>
    </div>
  );
};

export const ModernConnectScreen: React.FC<ModernConnectScreenProps> = ({ params: { session } }) => {
  const [getApproval, resolveApproval, rejectApproval] = useApproval();
  const { t } = useI18n();
  const wallet = useWallet();
  const currentKeyring = useCurrentKeyring();
  const currentAccount = useCurrentAccount();

  const [checkState, setCheckState] = useState<WebsiteState>(WebsiteState.CHECKING);
  const [warning, setWarning] = useState('');

  // Set window title
  useEffect(() => {
    document.title = session.origin || 'Universal Wallet';
  }, [session.origin]);

  useEffect(() => {
    wallet.checkWebsite(session.origin).then((v) => {
      if (v.isScammer) {
        setCheckState(WebsiteState.SCAMMER);
      } else {
        setCheckState(WebsiteState.SAFE);
      }
      if (v.warning) {
        setWarning(v.warning);
      }
    });
  }, [session.origin, wallet]);

  const handleCancel = () => {
    rejectApproval(t('user_rejected_the_request'));
  };

  const handleConnect = async () => {
    resolveApproval();
  };

  const handleAcknowledgeWarning = () => {
    setWarning('');
  };

  // Loading State
  if (checkState === WebsiteState.CHECKING) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--modern-bg-primary)'
        }}>
        <ModernLoadingSpinner size="large" />
      </div>
    );
  }

  // Scammer/Phishing State
  if (checkState === WebsiteState.SCAMMER) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--modern-bg-primary)'
        }}>
        <ModernWebsiteBar session={session} />

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center'
          }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(255, 59, 48, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '12px'
            }}>
            {t('phishing_detection')}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            style={{
              fontSize: '15px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6',
              marginBottom: '8px',
              maxWidth: '400px'
            }}>
            {t('malicious_behavior_and_suspicious_activity_have_be')}
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.5)',
              lineHeight: '1.5',
              maxWidth: '400px'
            }}>
            {t('your_access_to_this_page_has_been_restricted_by_un')}
          </motion.p>
        </div>

        <div style={{ padding: '20px', paddingTop: '0' }}>
          <ModernButton variant="destructive" size="large" fullWidth onClick={handleCancel}>
            {t('reject_blocked_by_unisat_wallet')}
          </ModernButton>
        </div>
      </div>
    );
  }

  // Warning State
  if (warning) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--modern-bg-primary)'
        }}>
        <ModernWebsiteBar session={session} />

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center'
          }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(255, 149, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff9500" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '12px'
            }}>
            {t('warning')}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            style={{
              fontSize: '15px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6',
              maxWidth: '400px'
            }}>
            {warning}
          </motion.p>
        </div>

        <div style={{ padding: '20px', paddingTop: '0' }}>
          <ModernButton variant="destructive" size="large" fullWidth onClick={handleAcknowledgeWarning}>
            {t('i_am_aware_of_the_risks')}
          </ModernButton>
        </div>
      </div>
    );
  }

  // Main Connect Screen
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--modern-bg-primary)'
      }}>
      <ModernWebsiteBar session={session} />

      <div
        style={{
          flex: 1,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          overflowY: 'auto'
        }}>
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '8px',
              letterSpacing: '-0.5px'
            }}>
            {t('connect_with_unisat_wallet')}
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '4px',
              lineHeight: '1.5'
            }}>
            {t('select_the_account_to_use_on_this_site')}
          </p>
          <p
            style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.5)',
              lineHeight: '1.4'
            }}>
            {t('only_connect_with_sites_you_trust')}
          </p>
        </motion.div>

        {/* Keyring Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
          <div
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
              marginBottom: '4px'
            }}>
            Wallet
          </div>
          <div
            style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#ffffff'
            }}>
            {currentKeyring.alianName}
          </div>
        </motion.div>

        {/* Account Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}>
          <ModernAccountCard account={currentAccount} selected={true} />
        </motion.div>
      </div>

      {/* Buttons */}
      <div
        style={{
          padding: '20px',
          paddingTop: '0',
          display: 'flex',
          gap: '12px'
        }}>
        <ModernButton variant="secondary" size="large" onClick={handleCancel} style={{ flex: 1 }}>
          {t('cancel')}
        </ModernButton>
        <ModernButton variant="primary" size="large" onClick={handleConnect} style={{ flex: 2 }}>
          {t('connect')}
        </ModernButton>
      </div>
    </div>
  );
};

export default ModernConnectScreen;

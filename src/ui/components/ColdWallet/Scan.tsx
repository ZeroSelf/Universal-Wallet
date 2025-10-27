import { useCallback, useEffect, useMemo, useState } from 'react';

import { Column, Progress, Text } from '@/ui/components';
import { useI18n } from '@/ui/hooks/useI18n';
import { colors } from '@/ui/theme/colors';
import { CameraOutlined } from '@ant-design/icons';
import {
  createUniversalDecoder,
  type ColdWalletData,
  type MsgSignResult,
  type TransactionSignResult
} from '@unisat/animated-qr';
import { AddressType } from '@unisat/wallet-types';
import { BrowserQRCodeReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';

interface Props {
  onSucceed: (data: ColdWalletData | TransactionSignResult | MsgSignResult | string) => void;
  size?: number;
}

const VIDEO_ID = 'cold-wallet-qr-scanner-video';

function ScanLine() {
  const [animationState, setAnimationState] = useState({ position: 10, opacity: 0 });

  useEffect(() => {
    let animationId: number;
    const duration = 4000;

    const animate = () => {
      const startTime = Date.now();

      const updateAnimation = () => {
        const elapsed = Date.now() - startTime;
        const progress = (elapsed % duration) / duration;

        let newPosition: number;
        let newOpacity: number;

        if (progress <= 0.5) {
          const downProgress = progress * 2;
          newPosition = 10 + downProgress * 80;

          if (downProgress <= 0.1) {
            newOpacity = downProgress / 0.1;
          } else if (downProgress >= 0.9) {
            newOpacity = (1 - downProgress) / 0.1;
          } else {
            newOpacity = 1;
          }
        } else {
          const upProgress = (progress - 0.5) * 2; // Scale 0.5-1 to 0-1
          newPosition = 90 - upProgress * 80;

          if (upProgress <= 0.1) {
            newOpacity = upProgress / 0.1;
          } else if (upProgress >= 0.9) {
            newOpacity = (1 - upProgress) / 0.1;
          } else {
            newOpacity = 1;
          }
        }

        setAnimationState({ position: newPosition, opacity: newOpacity });
        animationId = requestAnimationFrame(updateAnimation);
      };

      animationId = requestAnimationFrame(updateAnimation);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        left: '10%',
        right: '10%',
        top: `${animationState.position}%`,
        height: '2px',
        background: `linear-gradient(90deg, transparent 0%, ${colors.primary} 50%, transparent 100%)`,
        boxShadow: `0 0 6px ${colors.primary}`,
        opacity: animationState.opacity,
        zIndex: 2
      }}
    />
  );
}

export default function ColdWalletScan({ onSucceed, size = 300 }: Props) {
  const { t } = useI18n();
  const [isError, setIsError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [canplay, setCanplay] = useState(false);
  const [progressText, setProgressText] = useState<string>('');
  const [cameraState, setCameraState] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');

  // Universal decoder for all QR types
  const [decoder] = useState(() => createUniversalDecoder());

  // Create QR code reader
  const codeReader = useMemo(() => {
    const hint = new Map();
    hint.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);
    return new BrowserQRCodeReader(hint, {
      delayBetweenScanAttempts: 100,
      delayBetweenScanSuccess: 200
    });
  }, []);

  const setIsErrorWithTracking = useCallback((error: boolean, reason?: string) => {
    setIsError(error);
  }, []);

  const setCanplayWithTracking = useCallback((canplay: boolean, reason?: string) => {
    setCanplay(canplay);
  }, []);

  const handleQRScan = useCallback(
    (qrText: string) => {
      try {
        console.log('QR scanned:', qrText.substring(0, 100) + '...');

        const result = decoder.addPart(qrText);

        if (result?.isComplete && result.data) {
          console.log('Decode complete:', result.type, result.data);
          setProgress(100);
          setProgressText('');

          // Handle different data types
          const data = result.data;

          // Ensure cold wallet data has proper address type
          if (result.type === 'wallet' && data && typeof data === 'object' && 'addresses' in data) {
            const walletData = data as ColdWalletData;
            if (walletData.addressType === undefined) {
              walletData.addressType = AddressType.P2WPKH;
            }
          }

          onSucceed(data);
        } else if (result && !result.isComplete) {
          // Update progress for multi-part QR codes
          const percentage = result.percentage;
          const text =
            result.type === 'message'
              ? `Message decoding: ${percentage}%`
              : result.type === 'bbqr'
              ? `Collecting QR parts: ${result.collected}/${result.total} (${percentage}%)`
              : `Decoding: ${percentage}%`;

          console.log('Decode progress:', text);
          setProgress(percentage);
          setProgressText(text);
        } else {
          // No result or failed to decode
          console.log('Failed to decode QR code');
          setIsErrorWithTracking(true, 'Failed to decode QR code');
        }
      } catch (error) {
        console.error('QR scan error:', error);
        setIsErrorWithTracking(true, 'QR scan error');
      }
    },
    [decoder, onSucceed, setIsErrorWithTracking]
  );

  // Request camera permission and start scanning
  useEffect(() => {
    let mounted = true;

    const requestCameraAndStartScanning = async () => {
      try {
        // Check if camera permission is already granted
        if (navigator.permissions) {
          const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
          if (permission.state === 'denied') {
            setCameraState('denied');
            setIsErrorWithTracking(true, 'Camera permission denied');
            return;
          }
        }

        setCameraState('requesting');

        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (!mounted) {
          // Stop the stream if component was unmounted
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        setCameraState('granted');

        // Start scanning after permission is granted
        const videoElement = document.getElementById(VIDEO_ID) as HTMLVideoElement;
        if (!videoElement) {
          return;
        }

        const canplayListener = () => {
          console.log('Video can play, setting canplay=true');
          setCanplayWithTracking(true, 'video.oncanplay');
        };

        videoElement.addEventListener('canplay', canplayListener);

        const pendingScanRequest = (videoElement as any).pendingScanRequest ?? Promise.resolve(undefined);

        const scanRequest = pendingScanRequest
          .then(() => {
            return codeReader.decodeFromVideoDevice(undefined, videoElement, (result, error) => {
              if (result) {
                handleQRScan(result.getText());
              }
              if (
                error &&
                error.message &&
                error.message !== 'Dimensions could be not found.' &&
                !error.message.includes('NotFoundException') &&
                !error.message.includes('No MultiFormat Readers were able to detect the code') &&
                !error.message.includes('No QR code found')
              ) {
                console.error('Scanner error:', error);
              }
            });
          })
          .catch((error) => {
            console.error('Scanner setup error:', error);
            if (mounted) {
              setIsErrorWithTracking(true, 'Scanner setup error');
            }
            return undefined;
          });

        if (videoElement) {
          (videoElement as any).pendingScanRequest = scanRequest;
        }

        return () => {
          videoElement.removeEventListener('canplay', canplayListener);
          scanRequest.then((controls) => {
            if (controls) {
              controls.stop();
            }
          });
        };
      } catch (error) {
        console.error('Camera permission error:', error);
        if (mounted) {
          setCameraState('denied');
          setIsErrorWithTracking(true, 'Camera permission denied or not available');
        }
      }
    };

    requestCameraAndStartScanning();

    return () => {
      mounted = false;
    };
  }, [codeReader, handleQRScan, setCanplayWithTracking, setIsErrorWithTracking]);

  const onCloseError = useCallback(() => {
    setIsErrorWithTracking(false, 'onCloseError');
    setProgress(0);
    setCameraState('idle');
    // Reset decoder state
    decoder.reset();
    window.location.reload();
  }, [setIsErrorWithTracking, decoder]);

  return (
    <Column itemsCenter gap="md">
      <div
        style={{
          width: size,
          height: size,
          position: 'relative',
          background: colors.bg4,
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
        {/* Camera permission status display */}
        {cameraState === 'requesting' && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: colors.textDim,
              zIndex: 1
            }}>
            <CameraOutlined style={{ fontSize: 32, marginBottom: 8 }} />
            <div style={{ fontSize: 12 }}>{t('Requesting camera permission...')}</div>
          </div>
        )}

        {cameraState === 'denied' && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: colors.red,
              zIndex: 1
            }}>
            <CameraOutlined style={{ fontSize: 32, marginBottom: 8 }} />
            <div style={{ fontSize: 12 }}>{t('Camera permission denied')}</div>
          </div>
        )}

        {(cameraState === 'idle' || (cameraState === 'granted' && !canplay)) && (
          <CameraOutlined
            style={{
              fontSize: 32,
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: -16,
              marginLeft: -16,
              color: colors.textDim,
              zIndex: 1
            }}
          />
        )}

        <video
          id={VIDEO_ID}
          style={{
            display: canplay && !isError ? 'block' : 'none',
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          autoPlay
          muted
          playsInline
        />
        {/* Scanning line animation */}
        {canplay && !isError && <ScanLine />}
      </div>

      {progress > 0 && !isError && (
        <Column itemsCenter gap="sm">
          <Progress percent={progress} showInfo={false} size="small" strokeColor={colors.primary} />
          {progressText && <Text text={progressText} size="sm" color="primary" />}
        </Column>
      )}

      {isError && (
        <Column itemsCenter gap="sm">
          {cameraState === 'denied' ? (
            <>
              <Text text={t('Camera permission is required')} color="red" size="sm" />
              <Text
                text={t('Please enable camera access in your browser settings to scan QR codes')}
                size="xs"
                style={{ textAlign: 'center' }}
              />
              <button
                onClick={onCloseError}
                style={{
                  padding: '8px 16px',
                  background: colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                {t('Reload and Try Again')}
              </button>
            </>
          ) : (
            <>
              <Text text={t('Failed to scan QR code')} color="red" size="sm" />
              <Text
                text={t('Please ensure you are scanning a valid cold wallet QR code')}
                size="xs"
                style={{ textAlign: 'center' }}
              />
              <button
                onClick={onCloseError}
                style={{
                  padding: '8px 16px',
                  background: colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                {t('Try Again')}
              </button>
            </>
          )}
        </Column>
      )}

      <Text text={t('Position the QR code within the frame')} size="sm" style={{ textAlign: 'center' }} />

      {progress > 0 && progress < 100 && (
        <Column
          itemsCenter
          gap="sm"
          style={{
            padding: '8px 12px',
            backgroundColor: '#e6f3ff',
            borderRadius: '6px',
            border: '1px solid #2196F3'
          }}>
          <Text text={t('Multi-part QR Code Detected')} size="sm" color="primary" preset="bold" />
          <Text text={t('Keep scanning to collect all parts')} size="xs" style={{ textAlign: 'center' }} />
        </Column>
      )}
    </Column>
  );
}

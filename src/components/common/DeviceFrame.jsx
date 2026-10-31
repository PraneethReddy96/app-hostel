import React from 'react';
import { useHostel } from '../../context/HostelContext';
import { Wifi, Battery, Signal } from 'lucide-react';

export const DeviceFrame = ({ children }) => {
  const { deviceMode } = useHostel();
  const [isRealMobileScreen, setIsRealMobileScreen] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth <= 640 : false
  );

  React.useEffect(() => {
    const onResize = () => setIsRealMobileScreen(window.innerWidth <= 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Only show the decorative phone mockup frame when viewing on a desktop/laptop screen (>640px)
  if (deviceMode === 'mobile_preview' && !isRealMobileScreen) {
    return (
      <div className="device-container-wrapper mode-mobile">
        <div className="mobile-mockup-frame">
          {/* Top Notch / Dynamic Island */}
          <div className="mobile-notch">
            <div className="notch-camera"></div>
            <div className="notch-sensor"></div>
          </div>

          {/* Mobile Status Bar */}
          <div
            style={{
              position: 'absolute',
              top: 8,
              left: 20,
              right: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 90,
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              letterSpacing: '0.02em'
            }}
          >
            <span>09:41</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Signal size={12} />
              <Wifi size={12} />
              <Battery size={14} />
            </div>
          </div>

          {/* Scrollable Mobile Viewport */}
          <div className="mobile-frame-scrollable">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '130px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '9999px',
              zIndex: 90,
              pointerEvents: 'none'
            }}
          />
        </div>
      </div>
    );
  }

  // Standard fluid responsive or desktop wrapper
  return (
    <div
      className={`device-container-wrapper ${deviceMode === 'desktop' ? 'mode-desktop' : 'mode-fluid'}`}
      style={{
        maxWidth: deviceMode === 'desktop' ? '1440px' : '100%',
        margin: '0 auto'
      }}
    >
      <div className="fluid-wrapper">
        {children}
      </div>
    </div>
  );
};

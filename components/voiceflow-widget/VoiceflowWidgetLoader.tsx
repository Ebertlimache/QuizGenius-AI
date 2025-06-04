'use client';

import dynamic from 'next/dynamic';
import { VoiceflowConfig } from '@/hooks/useVoiceflowWidget';

const VoiceflowWidget = dynamic(
  () => import('./VoiceflowWidget'),
  {
    ssr: false,
    loading: () => null
  }
);

interface VoiceflowWidgetLoaderProps extends VoiceflowConfig {}

export default function VoiceflowWidgetLoader(props: VoiceflowWidgetLoaderProps) {
  return <VoiceflowWidget {...props} />;
} 
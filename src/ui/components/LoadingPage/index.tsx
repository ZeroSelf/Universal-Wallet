import { Content, Layout } from '@/ui/components';

import { Spin } from '../Spin';

export default function LoadingPage() {
  return (
    <Layout>
      <Content preset="middle" bg="background">
        <Spin size="large" />
      </Content>
    </Layout>
  );
}

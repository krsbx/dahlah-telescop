import MainLayout from '../layout/main-layout';

function Home() {
  /**
   * Update this later to show tables
   */
  return null
}

function HomeWithLayout() {
  return (
    <MainLayout>
      <Home />
    </MainLayout>
  );
}

export default HomeWithLayout;

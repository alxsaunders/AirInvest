export const metadata = {
    title: 'AirInvest',
    description: 'Data Driven Home Investment App',
  };
  
  export default function MetadataLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <>
        {/* No need to render anything in the body, just use it for metadata */}
        {children}
      </>
    );
  }
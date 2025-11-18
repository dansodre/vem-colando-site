import React from 'react';

interface StatusWrapperProps {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  skeleton: React.ReactNode;
  children: React.ReactNode;
}

const StatusWrapper: React.FC<StatusWrapperProps> = ({ isLoading, isError, error, skeleton, children }) => {
  if (isLoading) {
    return <>{skeleton}</>;
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">Ocorreu um Erro</h2>
        <p className="text-muted-foreground">{error?.message || 'Não foi possível carregar os dados. Tente novamente mais tarde.'}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default StatusWrapper;

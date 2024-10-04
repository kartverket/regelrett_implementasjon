import { useParams } from 'react-router-dom';

export const FunctionActivityPage = () => {
  const { functionId } = useParams();
  return <div>Function Activity Page for {functionId}</div>;
};

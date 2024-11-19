import { Link } from '@kvib/react';
import { Components } from 'react-markdown';

export const markdownComponents: Components = {
  a: ({ href, ...props }) => <Link href={href} {...props} />,
};

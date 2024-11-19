import { Components } from 'react-markdown';

export const markdownComponents: Components = {
  a: ({ href, ...props }) => (
    <a
      href={href}
      style={{
        textDecoration: 'underline',
      }}
      {...props}
    />
  ),
};

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useLayoutEffect,
  useEffect,
} from 'react';

const HeaderContext = createContext({
  title: '',
  setTitle: (title: string) => {},
});

export const HeaderTitleProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState('');
  return (
    <HeaderContext.Provider value={{ title, setTitle }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeaderTitle = (newTitle?: string) => {
  const { title, setTitle } = useContext(HeaderContext);

  useLayoutEffect(() => {
    if (newTitle) setTitle(newTitle);
  }, [newTitle]);

  return title;
};

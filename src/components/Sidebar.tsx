import { SearchBar } from './SearchBar';
import { MechanicList } from './MechanicList';

export const Sidebar = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            backgroundColor: '#f8fafc'
        }}>
            <SearchBar />
            <MechanicList />
        </div>
    );
};

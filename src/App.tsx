import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home, Login, Sales, Sale } from './pages';
import { Layout, ProtectedRoute } from './components';
function App() {
	return (
		<HashRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route element={<ProtectedRoute />}>
						<Route path='/' element={<Home />} />
						<Route path='/sales' element={<Sales />} />
						<Route path='/sales/:id' element={<Sale />} />
					</Route>
					<Route path='/login' element={<Login />} />
				</Route>
			</Routes>
		</HashRouter>
	);
}

export default App;

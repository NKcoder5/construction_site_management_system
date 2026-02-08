import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DailyLog from './components/reports/DailyLog';
import CreateLog from './components/logs/CreateLog';
import FloatingAIAssistant from './components/ai/FloatingAIAssistant';
import FinanceHub from './components/finance/FinanceHub';
import DrawingFiles from './components/drawings/DrawingDesk';
import StaffMap from './components/explore/StaffMap';
import SafetyOps from './components/safety/SafetyOps';
import Settings from './components/settings/Settings';
import EmployeeManager from './components/employees/EmployeeManager';
import ReportsDashboard from './components/reports/ReportsDashboard';
import OpsCommand from './components/ops/OpsCommand';
import { ThemeProvider } from './context/ThemeContext';

const ConditionalLayout = ({ children, showLayout = true }) => {
    return showLayout ? <Layout>{children}</Layout> : children;
};

function App() {
    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/feed" replace />} />

                    <Route path="/feed" element={
                        <ConditionalLayout>
                            <DailyLog />
                        </ConditionalLayout>
                    } />

                    <Route path="/create" element={
                        <ConditionalLayout>
                            <CreateLog />
                        </ConditionalLayout>
                    } />

                    <Route path="/finance" element={
                        <ConditionalLayout>
                            <FinanceHub />
                        </ConditionalLayout>
                    } />

                    <Route path="/drawings" element={
                        <ConditionalLayout>
                            <DrawingFiles />
                        </ConditionalLayout>
                    } />

                    <Route path="/ops" element={
                        <ConditionalLayout>
                            <OpsCommand />
                        </ConditionalLayout>
                    } />

                    <Route path="/explore" element={
                        <ConditionalLayout>
                            <StaffMap />
                        </ConditionalLayout>
                    } />

                    <Route path="/employees" element={
                        <ConditionalLayout>
                            <EmployeeManager />
                        </ConditionalLayout>
                    } />

                    <Route path="/reports" element={
                        <ConditionalLayout>
                            <ReportsDashboard />
                        </ConditionalLayout>
                    } />

                    <Route path="/safety" element={
                        <ConditionalLayout>
                            <SafetyOps />
                        </ConditionalLayout>
                    } />

                    <Route path="/settings" element={
                        <ConditionalLayout>
                            <Settings />
                        </ConditionalLayout>
                    } />

                </Routes>
                <FloatingAIAssistant />
            </Router>
        </ThemeProvider>
    );
}

export default App;

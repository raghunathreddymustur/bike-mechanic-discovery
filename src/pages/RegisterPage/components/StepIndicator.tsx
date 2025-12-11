// StepIndicator Component - Reusable progress indicator
// Follows Single Responsibility Principle

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

export const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
    return (
        <div style={{
            height: '4px',
            backgroundColor: '#e2e8f0',
            borderRadius: '4px',
            marginBottom: '32px',
            overflow: 'hidden'
        }}>
            <div style={{
                height: '100%',
                backgroundColor: '#667eea',
                width: `${(currentStep / totalSteps) * 100}%`,
                transition: 'width 0.3s'
            }}></div>
        </div>
    );
};

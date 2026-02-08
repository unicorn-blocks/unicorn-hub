import React, { useState, useMemo, useEffect } from 'react';
import styles from './SurveyModal.module.css';

// Question configuration
const QUESTIONS = [
    // 1. Initial branching question
    {
        id: 'q1',
        text: 'What stopped you from reserving Unicorn Blocks today?*',
        type: 'radio',
        options: [
            { label: 'Price', value: 'A' },
            { label: 'Not enough information available', value: 'B' },
            { label: 'Product availability (Don\'t like waiting)', value: 'C' },
            { label: 'Security/Trust', value: 'D' },
            { label: 'Other', value: 'E', hasOtherInput: true, placeholder: 'Please tell us more...' },
        ]
    },
    // Branch B: Missing Info
    {
        id: 'q1_b_followup',
        text: 'What important information is missing?*',
        type: 'text',
        condition: (answers) => answers.q1 === 'B'
    },
    // Branch D: Trust Issues
    {
        id: 'q1_d_followup',
        text: 'What security or trust concerns do you have?*',
        type: 'text',
        condition: (answers) => answers.q1 === 'D'
    },

    // 2. Standard Follow-up (Likes)
    {
        id: 'q2',
        text: 'What do you like about Unicorn Blocks?*',
        type: 'text'
    },
    // 3. Standard Follow-up (Dislikes)
    {
        id: 'q3',
        text: 'What do you dislike about Unicorn Blocks?*',
        type: 'text'
    },
    // 4. Price Perception (Great Value)
    {
        id: 'q4',
        text: 'At what price would you consider Unicorn Blocks to be a great buy for the money?*',
        type: 'radio',
        options: [
            { label: '$229+', value: 'A' },
            { label: '$199-229', value: 'B' },
            { label: '$179-199', value: 'C' },
            { label: '$159-179', value: 'D' },
            { label: '$139-159', value: 'E' },
            { label: 'Other', value: 'F', hasOtherInput: true },
        ]
    },
    // 5. Price Perception (Too Expensive/Hesitate)
    {
        id: 'q5',
        text: 'At what price would you start hesitating to buy Unicorn Blocks?*',
        type: 'radio',
        options: [
            { label: '$229+', value: 'A' },
            { label: '$199-229', value: 'B' },
            { label: '$179-199', value: 'C' },
            { label: '$159-179', value: 'D' },
            { label: '$139-159', value: 'E' },
            { label: 'Other', value: 'F', hasOtherInput: true },
        ]
    },
    // 6. Problem Solve
    {
        id: 'q6',
        text: 'What problem does Unicorn Blocks solve for you?*',
        type: 'text'
    },
    // 7. Suggestions
    {
        id: 'q7',
        text: 'What would you change in Unicorn Blocks in order to make it better?*',
        subtext: 'For example, feature, color, or other preferences.',
        type: 'text'
    },
    // 8. Child Age
    {
        id: 'q8',
        text: 'What age is your child?',
        type: 'checkbox',
        options: [
            { label: '3-4', value: 'A' },
            { label: '5-6', value: 'B' },
            { label: '7-8', value: 'C' },
            { label: 'I\'m shopping as a gift for friends/families kids', value: 'D' },
        ]
    },
    // 9. Gender Identity
    {
        id: 'q9',
        text: 'How do you identify?*',
        type: 'radio',
        options: [
            { label: 'Male', value: 'A' },
            { label: 'Female', value: 'B' },
            { label: 'Prefer Not to Mention', value: 'C' },
            { label: 'Other', value: 'D', hasOtherInput: true },
        ]
    },
    // 10. User Age
    {
        id: 'q10',
        text: 'What is your age?*',
        type: 'radio',
        options: [
            { label: 'Under 24', value: 'A' },
            { label: '25 - 34', value: 'B' },
            { label: '35 - 44', value: 'C' },
            { label: '45 - 54', value: 'D' },
            { label: '55 - 64', value: 'E' },
            { label: '65 +', value: 'F' },
        ]
    },
    // 11. Occupation
    {
        id: 'q11',
        text: 'What is your current occupation?*',
        type: 'text',
        short: true
    },
    // 12. Income Range
    {
        id: 'q12',
        text: 'What is your income range?*',
        type: 'radio',
        options: [
            { label: '$0-$49K', value: 'A' },
            { label: '$50K-$99K', value: 'B' },
            { label: '$100K-$199K', value: 'C' },
            { label: '$200K+', value: 'D' },
            { label: 'Rather not share', value: 'E' },
        ]
    },
    // 13. Innovation Adoption (Scale 1-5)
    {
        id: 'q13',
        text: 'I am always the first person to buy the latest products/innovations in this category.*',
        type: 'scale',
        min: 1,
        max: 5,
        labels: { min: 'Strongly Disagree', max: 'Strongly Agree' }
    },
    // 14. Email
    {
        id: 'q14_email',
        text: 'Would you like to be involved in shaping Unicorn Blocks? If so, share your email, and we\'ll reach out to hear your thoughts!',
        type: 'text', // Email input treated as text
        short: true,
        placeholder: 'Enter email here'
    },
    // 15. Recommendation (Net Promoter Score)
    {
        id: 'q15_nps',
        text: 'How likely are you to recommend Unicorn Blocks to others?*',
        type: 'scale',
        min: 0,
        max: 10,
        labels: { min: 'Not likely at all', max: 'Extremely likely' }
    }
];

export default function SurveyModal({ isOpen, onClose, onSubmit }) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [otherInputs, setOtherInputs] = useState({}); // For "Other" text fields
    const [errorMsg, setErrorMsg] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [viewportHeight, setViewportHeight] = useState('100%');

    // Handle Visual Viewport resizing (keyboard handling on mobile)
    useEffect(() => {
        if (!isOpen) return;

        const handleResize = () => {
            if (window.visualViewport) {
                setViewportHeight(`${window.visualViewport.height}px`);
                // Scroll focused element into view
                if (document.activeElement &&
                    (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
                    setTimeout(() => {
                        document.activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                }
            } else {
                setViewportHeight('100%');
            }
        };

        if (typeof window !== 'undefined' && window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleResize);
            // Initial set
            handleResize();
        } else if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (typeof window !== 'undefined' && window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleResize);
            } else if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, [isOpen]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Determine active questions based on current answers
    const activeQuestions = useMemo(() => {
        return QUESTIONS.filter(q => !q.condition || q.condition(answers));
    }, [answers]);

    const currentQuestion = activeQuestions[currentStepIndex];
    if (!isOpen) return null;
    const isLastQuestion = currentStepIndex === activeQuestions.length - 1;
    const progressPercentage = ((currentStepIndex + 1) / activeQuestions.length) * 100;

    // Handlers
    const handleAnswer = (value) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
        if (errorMsg) setErrorMsg('');
    };

    const handleOtherInputChange = (value) => {
        setOtherInputs(prev => ({ ...prev, [currentQuestion.id]: value }));
        if (errorMsg) setErrorMsg('');
    };

    const handleOptionClick = (option) => {
        if (currentQuestion.type === 'checkbox') {
            const currentAnswers = answers[currentQuestion.id] || [];
            let newAnswers;
            if (currentAnswers.includes(option.value)) {
                newAnswers = currentAnswers.filter(a => a !== option.value);
            } else {
                newAnswers = [...currentAnswers, option.value];
            }
            handleAnswer(newAnswers);
            // No auto-advance for checkbox
        } else {
            handleAnswer(option.value);

            // Auto-advance if not "Other" (no text input required)
            if (!option.hasOtherInput) {
                // Small delay to show selection visual feedback
                setTimeout(() => {
                    handleNext(true, option.value);
                }, 150);
            }
        }
    };

    const handleNext = (skipValidation = false, answerOverride = null) => {
        // Special validation for "Other" text input
        const currentAnswer = answerOverride || answers[currentQuestion.id];
        let newErrorMsg = '';

        if (!currentQuestion.optional) {
            if (!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)) {
                newErrorMsg = 'Please fill this in';
            } else {
                if (Array.isArray(currentAnswer)) {
                    // Checkbox validation
                    const selectedValues = currentAnswer;
                    const question = currentQuestion;

                    for (const val of selectedValues) {
                        const opt = question.options?.find(o => o.value === val);
                        if (opt?.hasOtherInput) {
                            const otherText = otherInputs[currentQuestion.id];
                            if (!otherText || otherText.trim() === '') {
                                newErrorMsg = 'Please fill this in';
                                break;
                            }
                        }
                    }
                } else {
                    // Radio validation
                    const selectedOption = currentQuestion.options?.find(o => o.value === currentAnswer);
                    if (selectedOption?.hasOtherInput) {
                        const otherText = otherInputs[currentQuestion.id];
                        if (!otherText || otherText.trim() === '') {
                            newErrorMsg = 'Please fill this in';
                        }
                    }
                }
            }
        }

        // Email format validation for Q14
        if (!newErrorMsg && currentQuestion.id === 'q14_email' && currentAnswer) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(currentAnswer.trim())) {
                newErrorMsg = 'Please enter correct email';
            }
        }

        if (newErrorMsg && !skipValidation) {
            setErrorMsg(newErrorMsg);
            return;
        }

        if (isLastQuestion) {
            // Compile final data including "Other" inputs
            const finalData = { ...answers };
            if (answerOverride) finalData[currentQuestion.id] = answerOverride;

            // Merge "Other" text inputs if "Other" option was selected
            Object.keys(otherInputs).forEach(key => {
                // We need to check if the *final* answer for this question corresponds to an "Other" option
                // Because user might have selected "Other", typed, then changed to a non-Other option.
                // But simplified check is sufficient as long as we check against current answers
                const qAnswer = key === currentQuestion.id && answerOverride ? answerOverride : answers[key];
                const question = QUESTIONS.find(q => q.id === key);
                const selectedOpt = question?.options?.find(o => o.value === qAnswer);

                if (selectedOpt?.hasOtherInput) {
                    finalData[`${key}_other_text`] = otherInputs[key];
                }
            });

            // Submit logic
            if (onSubmit) {
                onSubmit(finalData);
            }
            setShowSuccess(true);
        } else {
            setCurrentStepIndex(prev => prev + 1);
            setErrorMsg(''); // Reset error state for next question
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        } else {
            // Optional: Close modal on first screen back? Or just disable?
            // For now, allow close only via X
        }
    };

    // Render Helpers
    const renderOptions = () => {
        const isSelected = (val) => {
            if (currentQuestion.type === 'checkbox') {
                return (answers[currentQuestion.id] || []).includes(val);
            }
            return answers[currentQuestion.id] === val;
        };

        return (
            <div className={styles.inputGroup}>
                {currentQuestion.options.map(option => (
                    <div key={option.value}>
                        <button
                            className={`${styles.optionButton} ${isSelected(option.value) ? styles.selected : ''}`}
                            onClick={() => handleOptionClick(option)}
                        >
                            {/* Checkbox indicator for multi-select */}
                            {currentQuestion.type === 'checkbox' && (
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '4px',
                                    border: isSelected(option.value) ? 'none' : '2px solid #D1D5DB',
                                    backgroundColor: isSelected(option.value) ? '#9b90da' : 'transparent',
                                    marginRight: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {isSelected(option.value) && (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                            )}
                            {/* Radio indicator for single-select (optional, but good for consistency if desired, otherwise just text) */}
                            {currentQuestion.type === 'radio' && (
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    border: isSelected(option.value) ? 'none' : '2px solid #D1D5DB',
                                    backgroundColor: isSelected(option.value) ? '#9b90da' : 'transparent',
                                    marginRight: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {isSelected(option.value) && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />}
                                </div>
                            )}

                            {option.label}
                        </button>
                        {option.hasOtherInput && isSelected(option.value) && (
                            <div className={styles.otherInputWrapper}>
                                <input
                                    type="text"
                                    className={`${styles.textInput} ${styles.shortTextInput}`}
                                    placeholder={option.placeholder || "Please specify..."}
                                    value={otherInputs[currentQuestion.id] || ''}
                                    onChange={(e) => handleOtherInputChange(e.target.value)}
                                    autoFocus
                                />
                                {errorMsg && (!otherInputs[currentQuestion.id] || otherInputs[currentQuestion.id].trim() === '') && (
                                    <div className={styles.errorText}>{errorMsg}</div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderTextInput = () => {
        return (
            <div style={{ position: 'relative' }}>
                <textarea
                    className={`${styles.textInput} ${currentQuestion.short ? styles.shortTextInput : ''}`}
                    placeholder={currentQuestion.placeholder || "Type your answer here..."}
                    value={answers[currentQuestion.id] || ''}
                    rows={currentQuestion.short ? 1 : 4}
                    onChange={(e) => handleAnswer(e.target.value)}
                />
                {errorMsg && (
                    <div className={styles.errorText} style={{ marginTop: '0' }}>{errorMsg}</div>
                )}
            </div>
        );
    };

    const renderScale = () => {
        const min = currentQuestion.min;
        const max = currentQuestion.max;
        const items = [];
        for (let i = min; i <= max; i++) {
            items.push(i);
        }

        return (
            <div style={{ position: 'relative' }}>
                <div className={styles.scaleContainer}>
                    {items.map(val => (
                        <button
                            key={val}
                            className={`${styles.scaleButton} ${answers[currentQuestion.id] === val ? styles.selected : ''}`}
                            onClick={() => {
                                handleAnswer(val);
                                setTimeout(() => {
                                    handleNext(true, val);
                                }, 150);
                            }}
                        >
                            {val}
                        </button>
                    ))}
                </div>
                {currentQuestion.labels && (
                    <div className={styles.scaleLabels}>
                        <span>{currentQuestion.labels.min}</span>
                        <span>{currentQuestion.labels.max}</span>
                    </div>
                )}
                {errorMsg && !answers[currentQuestion.id] && (
                    <div className={styles.errorText} style={{ marginTop: '0' }}>{errorMsg}</div>
                )}
            </div>
        );
    };

    const isCurrentStepValid = () => {
        if (currentQuestion.optional) return true;
        const ans = answers[currentQuestion.id];
        if (ans === undefined || ans === '' || ans === null) return false;

        // If "Other" is selected, require text input? (Optional, stringent check)
        // For now, standard check is enough.
        return true;
    };

    return (
        <div className={styles.popModalMask}>
            <div className={styles.popModalMain}>
                {showSuccess ? (
                    /* Success Screen */
                    <div className={styles.successScreen}>
                        <div className={styles.successIcon}>
                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="40" cy="40" r="40" fill="#10B981" fillOpacity="0.1" />
                                <circle cx="40" cy="40" r="30" fill="#10B981" fillOpacity="0.2" />
                                <circle cx="40" cy="40" r="20" fill="#10B981" />
                                <path d="M32 40L37 45L48 34" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h2 className={styles.successTitle}>Thank You!</h2>
                        <p className={styles.successMessage}>
                            Your feedback helps us create better experiences for families like yours.
                        </p>
                        <p className={styles.successSubMessage}>
                            🎁 Gift card winners will be notified via email.
                        </p>
                        <button className={styles.successBtn} onClick={onClose}>
                            Back to Page
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Progress Bar */}
                        <div className={styles.progressBarContainer}>
                            <div className={styles.progressBarFill} style={{ width: `${progressPercentage}%` }}></div>
                        </div>

                        {/* Close Button */}
                        <button className={styles.closeBtn} onClick={onClose} aria-label="close">×</button>

                        {/* Content */}
                        <div className={styles.modalContent}>
                            {/* Wrap changing content in a keyed div for animation */}
                            <div key={currentStepIndex} className={`${styles.fadeIn} ${styles.questionContent}`}>
                                <div className={styles.questionHeader}>
                                    <div className={styles.questionBadge}>{currentStepIndex + 1}</div>
                                    <div className={styles.promoBadge}>🎁 Finish to Win $10 Amazon Gift Card</div>
                                </div>

                                <h2 className={styles.questionText}>
                                    {currentQuestion.text}
                                    {currentQuestion.subtext && (
                                        <div style={{ fontSize: '0.9rem', fontWeight: 400, marginTop: '8px', color: '#6B7280' }}>
                                            {currentQuestion.subtext}
                                        </div>
                                    )}
                                </h2>

                                {(currentQuestion.type === 'radio' || currentQuestion.type === 'checkbox') && renderOptions()}
                                {currentQuestion.type === 'text' && renderTextInput()}
                                {currentQuestion.type === 'scale' && renderScale()}
                            </div>

                            <div className={styles.modalFooter}>
                                {currentStepIndex > 0 && (
                                    <button className={styles.backBtn} onClick={handleBack}>
                                        {/* Back Arrow Icon */}
                                        {/* Back Arrow Icon - Filled */}
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', minWidth: '24px' }}>
                                            <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="white" />
                                        </svg>
                                    </button>
                                )}

                                <button
                                    className={styles.submitBtn}
                                    onClick={() => handleNext()}
                                >
                                    {isLastQuestion ? 'Submit' : 'OK'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

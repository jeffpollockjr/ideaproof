import { createContext, useContext, useState, useCallback } from 'react';
import { seedIdeas, seedNotifications, demoUser } from '../data/seedData';

const AppContext = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

// Calculate validation score dynamically
const calcScore = (idea) => {
  let score = 0;
  const { survey, landingPage, preOrder, emailList, validationConfig } = idea;

  // Survey: up to 30 pts
  if (validationConfig.survey) {
    const r = survey.responses.length;
    score += Math.min(30, Math.round((r / 100) * 30));
  }

  // Landing page CTR: up to 25 pts
  if (validationConfig.landingPage && landingPage.metrics.visitors > 0) {
    const ctr = landingPage.metrics.clicks / landingPage.metrics.visitors;
    score += Math.min(25, Math.round(ctr * 100));
  }

  // Pre-orders: up to 30 pts
  if (validationConfig.preOrder) {
    const r = preOrder.responses.length;
    score += Math.min(30, Math.round((r / 60) * 30));
  }

  // Email list: up to 15 pts
  if (validationConfig.emailCapture || emailList.length > 0) {
    const e = emailList.length;
    score += Math.min(15, Math.round((e / 80) * 15));
  }

  return Math.min(100, score);
};

const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [ideas, setIdeas] = useState(seedIdeas);
  const [notifications, setNotifications] = useState(seedNotifications);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const loginAsDemo = useCallback(() => {
    setUser(demoUser);
    setIsAuthenticated(true);
  }, []);

  const login = useCallback((email, _password) => {
    setUser({ ...demoUser, email });
    setIsAuthenticated(true);
  }, []);

  const register = useCallback((data) => {
    setUser({ id: uid(), name: data.name, email: data.email, avatar: data.name.slice(0, 2).toUpperCase(), role: data.role, joinedAt: new Date().toISOString().split('T')[0] });
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // ── Ideas ────────────────────────────────────────────────────────────────
  const addIdea = useCallback((data) => {
    const newIdea = {
      id: `idea_${uid()}`,
      title: data.title,
      oneLiner: data.oneLiner,
      category: data.category,
      emoji: data.emoji || '💡',
      status: 'draft',
      validationScore: 0,
      pitch: data.pitch || { problem: '', solution: '', targetCustomer: '', businessModel: '' },
      validationConfig: data.validationConfig || { survey: false, landingPage: false, preOrder: false, emailCapture: false },
      survey: { questions: [], responses: [] },
      landingPage: {
        headline: '', subheadline: '', cta: 'Get Early Access',
        isRunning: false, metrics: { impressions: 0, visitors: 0, clicks: 0 },
      },
      preOrder: { tiers: [], responses: [] },
      emailList: [],
      marketplace: { callPrice: 199, isListed: false, callsBooked: [] },
      createdAt: new Date().toISOString().split('T')[0],
    };
    setIdeas(prev => [newIdea, ...prev]);
    return newIdea.id;
  }, []);

  const updateIdea = useCallback((id, updates) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id !== id) return idea;
      const updated = { ...idea, ...updates };
      updated.validationScore = calcScore(updated);
      if (updated.validationScore > 0 && updated.status === 'draft') {
        updated.status = 'validating';
      }
      return updated;
    }));
  }, []);

  const deleteIdea = useCallback((id) => {
    setIdeas(prev => prev.filter(i => i.id !== id));
  }, []);

  // ── Survey ───────────────────────────────────────────────────────────────
  const addSurveyQuestion = useCallback((ideaId, question) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id !== ideaId) return idea;
      const updated = {
        ...idea,
        survey: { ...idea.survey, questions: [...idea.survey.questions, { id: `q_${uid()}`, ...question }] },
      };
      updated.validationScore = calcScore(updated);
      return updated;
    }));
  }, []);

  const updateSurveyQuestion = useCallback((ideaId, questionId, changes) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id !== ideaId) return idea;
      return {
        ...idea,
        survey: {
          ...idea.survey,
          questions: idea.survey.questions.map(q => q.id === questionId ? { ...q, ...changes } : q),
        },
      };
    }));
  }, []);

  const deleteSurveyQuestion = useCallback((ideaId, questionId) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id !== ideaId) return idea;
      return {
        ...idea,
        survey: { ...idea.survey, questions: idea.survey.questions.filter(q => q.id !== questionId) },
      };
    }));
  }, []);

  const addSurveyResponse = useCallback((ideaId, response) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id !== ideaId) return idea;
      const updated = {
        ...idea,
        survey: { ...idea.survey, responses: [...idea.survey.responses, { id: `r_${uid()}`, date: new Date().toISOString().split('T')[0], ...response }] },
      };
      updated.validationScore = calcScore(updated);
      return updated;
    }));
  }, []);

  // ── Landing Page ──────────────────────────────────────────────────────────
  const updateLandingPage = useCallback((ideaId, data) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id !== ideaId) return idea;
      const updated = { ...idea, landingPage: { ...idea.landingPage, ...data } };
      updated.validationScore = calcScore(updated);
      return updated;
    }));
  }, []);

  const simulateTraffic = useCallback((ideaId) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id !== ideaId) return idea;
      const m = idea.landingPage.metrics;
      const newImpressions = m.impressions + Math.floor(Math.random() * 600 + 200);
      const newVisitors = m.visitors + Math.floor(Math.random() * 150 + 50);
      const newClicks = m.clicks + Math.floor(Math.random() * 40 + 10);
      const updated = {
        ...idea,
        landingPage: {
          ...idea.landingPage,
          isRunning: true,
          metrics: { impressions: newImpressions, visitors: newVisitors, clicks: newClicks },
        },
      };
      updated.validationScore = calcScore(updated);
      return updated;
    }));
  }, []);

  // ── Pre-Order ─────────────────────────────────────────────────────────────
  const updatePreOrderTiers = useCallback((ideaId, tiers) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id !== ideaId) return idea;
      return { ...idea, preOrder: { ...idea.preOrder, tiers } };
    }));
  }, []);

  const addPreOrderResponse = useCallback((ideaId, response) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id !== ideaId) return idea;
      const newEmail = { id: `e_${uid()}`, email: response.email, source: 'pre-order', status: 'interested', date: new Date().toISOString().split('T')[0] };
      const updated = {
        ...idea,
        preOrder: { ...idea.preOrder, responses: [...idea.preOrder.responses, { id: `po_${uid()}`, date: new Date().toISOString().split('T')[0], ...response }] },
        emailList: [...idea.emailList, newEmail],
      };
      updated.validationScore = calcScore(updated);
      return updated;
    }));
  }, []);

  // ── Email List ────────────────────────────────────────────────────────────
  const updateEmailStatus = useCallback((ideaId, emailId, status) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id !== ideaId) return idea;
      return { ...idea, emailList: idea.emailList.map(e => e.id === emailId ? { ...e, status } : e) };
    }));
  }, []);

  // ── Marketplace ───────────────────────────────────────────────────────────
  const updateMarketplace = useCallback((ideaId, data) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id !== ideaId) return idea;
      const updated = { ...idea, marketplace: { ...idea.marketplace, ...data } };
      if (data.isListed && idea.status === 'validating') updated.status = 'listed';
      if (data.isListed === false && idea.status === 'listed') updated.status = 'validating';
      return updated;
    }));
  }, []);

  const bookCall = useCallback((ideaId, booking) => {
    const newBooking = { id: `cb_${uid()}`, ...booking, status: 'upcoming' };
    setIdeas(prev => prev.map(idea => {
      if (idea.id !== ideaId) return idea;
      return { ...idea, marketplace: { ...idea.marketplace, callsBooked: [...idea.marketplace.callsBooked, newBooking] } };
    }));
    // Add notification
    const idea = ideas.find(i => i.id === ideaId);
    if (idea) {
      setNotifications(prev => [{
        id: `n_${uid()}`, type: 'call_booked',
        message: `${booking.buyerName} booked a call for ${idea.title}`,
        ideaId, ideaTitle: idea.title, read: false,
        date: new Date().toISOString().split('T')[0],
      }, ...prev]);
    }
    return newBooking;
  }, [ideas]);

  // ── Notifications ─────────────────────────────────────────────────────────
  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    isAuthenticated, user, ideas, notifications, unreadCount,
    loginAsDemo, login, register, logout,
    addIdea, updateIdea, deleteIdea,
    addSurveyQuestion, updateSurveyQuestion, deleteSurveyQuestion, addSurveyResponse,
    updateLandingPage, simulateTraffic,
    updatePreOrderTiers, addPreOrderResponse,
    updateEmailStatus,
    updateMarketplace, bookCall,
    markNotificationRead, markAllRead,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

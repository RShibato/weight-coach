import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { Calendar, TrendingDown, Droplet, Utensils, Plus, Trash2, Target, Award, User, LogOut, Search, Info, Activity, Scale, Ruler, Percent, Users, Minus } from 'lucide-react';

// 食材データベース（カロミル簡易版）
const FOOD_DATABASE = {
  proteins: [
    { id: 1, name: '鶏胸肉（皮なし）', calories: 108, protein: 22.3, carbs: 0, fat: 1.5, unit: '100g' },
    { id: 2, name: 'ささみ', calories: 105, protein: 23, carbs: 0, fat: 0.8, unit: '100g' },
    { id: 3, name: '牛赤身肉', calories: 140, protein: 21, carbs: 0.5, fat: 4.6, unit: '100g' },
    { id: 4, name: 'サーモン', calories: 142, protein: 20, carbs: 0, fat: 6.5, unit: '100g' },
    { id: 5, name: 'まぐろ（赤身）', calories: 125, protein: 26, carbs: 0.1, fat: 1.4, unit: '100g' },
    { id: 6, name: '卵（全卵）', calories: 151, protein: 12.3, carbs: 0.3, fat: 10.3, unit: '100g' },
    { id: 7, name: '卵白', calories: 47, protein: 10.5, carbs: 0.4, fat: 0.1, unit: '100g' },
    { id: 8, name: 'プロテイン（ホエイ）', calories: 100, protein: 20, carbs: 3, fat: 1.5, unit: '1スクープ（25g）' },
  ],
  carbs: [
    { id: 9, name: '玄米', calories: 165, protein: 2.8, carbs: 35, fat: 1, unit: '100g（炊飯後）' },
    { id: 10, name: '白米', calories: 168, protein: 2.5, carbs: 37, fat: 0.3, unit: '100g（炊飯後）' },
    { id: 11, name: 'オートミール', calories: 380, protein: 13.7, carbs: 69.1, fat: 5.7, unit: '100g' },
    { id: 12, name: 'さつまいも', calories: 132, protein: 1.2, carbs: 31.5, fat: 0.2, unit: '100g' },
    { id: 13, name: 'バナナ', calories: 86, protein: 1.1, carbs: 22.5, fat: 0.2, unit: '1本（100g）' },
    { id: 14, name: 'そば', calories: 132, protein: 4.8, carbs: 26, fat: 0.7, unit: '100g（茹で）' },
  ],
  vegetables: [
    { id: 15, name: 'ブロッコリー', calories: 33, protein: 4.3, carbs: 5.2, fat: 0.5, unit: '100g' },
    { id: 16, name: 'ほうれん草', calories: 20, protein: 2.2, carbs: 3.1, fat: 0.4, unit: '100g' },
    { id: 17, name: 'アボカド', calories: 187, protein: 2.5, carbs: 6.2, fat: 18.7, unit: '1個（100g）' },
    { id: 18, name: 'トマト', calories: 19, protein: 0.7, carbs: 4.7, fat: 0.1, unit: '1個（100g）' },
  ],
  convenience: [
    { id: 19, name: 'サラダチキン（プレーン）', calories: 110, protein: 24, carbs: 0, fat: 1.5, unit: '1個（100g）' },
    { id: 20, name: 'ゆで卵', calories: 76, protein: 6.2, carbs: 0.2, fat: 5.2, unit: '1個（50g）' },
    { id: 21, name: 'ミックスナッツ', calories: 590, protein: 19, carbs: 20, fat: 51, unit: '100g' },
    { id: 22, name: 'プロテインバー', calories: 180, protein: 15, carbs: 20, fat: 5, unit: '1本' },
  ],
  restaurants: [
    { id: 23, name: 'セブン：おにぎり（鮭）', calories: 179, protein: 4.5, carbs: 37, fat: 1.5, unit: '1個' },
    { id: 24, name: 'ファミマ：サラダチキン', calories: 113, protein: 25, carbs: 0, fat: 1.1, unit: '1個' },
    { id: 25, name: '吉野家：牛丼（並）', calories: 652, protein: 21, carbs: 92, fat: 20, unit: '1杯' },
    { id: 26, name: 'すき家：牛丼ライト', calories: 425, protein: 23, carbs: 42, fat: 16, unit: '1杯' },
  ]
};

// 階級データベース
const WEIGHT_CLASSES = {
  boxing: {
    male: [
      { name: 'ミニマム級', max: 47.6, min: 0 },
      { name: 'ライトフライ級', max: 48.9, min: 47.6 },
      { name: 'フライ級', max: 50.8, min: 48.9 },
      { name: 'スーパーフライ級', max: 52.2, min: 50.8 },
      { name: 'バンタム級', max: 53.5, min: 52.2 },
      { name: 'スーパーバンタム級', max: 55.3, min: 53.5 },
      { name: 'フェザー級', max: 57.2, min: 55.3 },
      { name: 'スーパーフェザー級', max: 59.0, min: 57.2 },
      { name: 'ライト級', max: 61.2, min: 59.0 },
      { name: 'スーパーライト級', max: 63.5, min: 61.2 },
      { name: 'ウェルター級', max: 66.7, min: 63.5 },
      { name: 'スーパーウェルター級', max: 69.9, min: 66.7 },
      { name: 'ミドル級', max: 72.6, min: 69.9 },
      { name: 'スーパーミドル級', max: 76.2, min: 72.6 },
      { name: 'ライトヘビー級', max: 79.4, min: 76.2 },
      { name: 'クルーザー級', max: 90.7, min: 79.4 },
      { name: 'ヘビー級', max: 999, min: 90.7 },
    ],
    female: [
      { name: 'ミニマム級', max: 47.6, min: 0 },
      { name: 'ライトフライ級', max: 48.9, min: 47.6 },
      { name: 'フライ級', max: 50.8, min: 48.9 },
      { name: 'スーパーフライ級', max: 52.2, min: 50.8 },
      { name: 'バンタム級', max: 53.5, min: 52.2 },
      { name: 'スーパーバンタム級', max: 55.3, min: 53.5 },
      { name: 'フェザー級', max: 57.2, min: 55.3 },
      { name: 'スーパーフェザー級', max: 59.0, min: 57.2 },
      { name: 'ライト級', max: 61.2, min: 59.0 },
      { name: 'スーパーライト級', max: 63.5, min: 61.2 },
      { name: 'ウェルター級', max: 66.7, min: 63.5 },
    ]
  },
  kickboxing: {
    male: [
      { name: 'バンタム級', max: 55, min: 0 },
      { name: 'フェザー級', max: 57.5, min: 55 },
      { name: 'ライト級', max: 60, min: 57.5 },
      { name: 'スーパーライト級', max: 62.5, min: 60 },
      { name: 'ウェルター級', max: 65, min: 62.5 },
      { name: 'スーパーウェルター級', max: 67.5, min: 65 },
      { name: 'ミドル級', max: 70, min: 67.5 },
      { name: 'スーパーミドル級', max: 75, min: 70 },
      { name: 'ライトヘビー級', max: 80, min: 75 },
      { name: 'クルーザー級', max: 85, min: 80 },
      { name: 'ヘビー級', max: 999, min: 85 },
    ],
    female: [
      { name: 'アトム級', max: 49, min: 0 },
      { name: 'バンタム級', max: 53, min: 49 },
      { name: 'フェザー級', max: 55, min: 53 },
      { name: 'ライト級', max: 57, min: 55 },
      { name: 'スーパーライト級', max: 59, min: 57 },
      { name: 'ウェルター級', max: 61, min: 59 },
    ]
  }
};

const FighterWeightApp = () => {
  // ユーザー管理
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signupForm, setSignupForm] = useState({ username: '', password: '', confirmPassword: '', email: '', subscribeNewsletter: false });
  const [isSignup, setIsSignup] = useState(false);
  
  // 既存の状態
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weightRecords, setWeightRecords] = useState([]);
  const [mealRecords, setMealRecords] = useState([]);
  const [waterRecords, setWaterRecords] = useState([]);
  const [fightDate, setFightDate] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [currentBodyFat, setCurrentBodyFat] = useState('');
  // 設定編集用
  const [tempFightDate, setTempFightDate] = useState('');
  const [tempTargetWeight, setTempTargetWeight] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // オンボーディング
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    goal: '', // 'weight_cut', 'build', 'explore'
    sport: 'boxing',
    gender: 'male',
    experienceLevel: '', // 'beginner', 'intermediate', 'advanced', 'pro'
    currentWeight: '',
    height: '',
    bodyFat: '',
    hasFight: false,
    fightDate: '',
    targetWeight: '',
  });
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [todayWater, setTodayWater] = useState(0);
  const [showMentalCheck, setShowMentalCheck] = useState(false);
  const [mentalRecords, setMentalRecords] = useState([]);
  
  // 新機能の状態
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('proteins');
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodAmount, setFoodAmount] = useState(1);
  const [showClassDiagnosis, setShowClassDiagnosis] = useState(false);
  
  // プロフィールデータ（適正階級診断用）
  const [userProfile, setUserProfile] = useState({
    height: '',
    reach: '',
    bodyFat: '',
    wristSize: '',
    ankleSize: '',
    naturalWeight: '',
    gender: 'male',
    sport: 'boxing', // boxing or kickboxing
    // 将来のソーシャル機能用
    displayName: '',
    gym: '',
    record: { wins: 0, losses: 0, draws: 0 },
    bio: '',
    favoriteStyle: '',
  });

  // 初期化：ログイン状態とユーザーデータの読み込み
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      loadUserData(user.username);
    } else {
      setShowLogin(true);
    }
  }, []);

  // ユーザーデータの読み込み
  const loadUserData = (username) => {
    const userDataKey = `userData_${username}`;
    const savedData = localStorage.getItem(userDataKey);
    
    if (savedData) {
      const data = JSON.parse(savedData);
      
      // オンボーディングが完了していない場合は表示
      if (!data.onboardingCompleted) {
        setShowOnboarding(true);
        return;
      }
      
      setWeightRecords(data.weightRecords || []);
      setMealRecords(data.mealRecords || []);
      setWaterRecords(data.waterRecords || []);
      setMentalRecords(data.mentalRecords || []);
      setFightDate(data.fightDate || '');
      setTargetWeight(data.targetWeight || '');
      setUserProfile(data.userProfile || userProfile);
      
      // 今日の水分摂取量
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = (data.waterRecords || []).find(w => w.date === today);
      if (todayRecord) setTodayWater(todayRecord.amount);
    } else {
      // 新規ユーザーはオンボーディングへ
      setShowOnboarding(true);
    }
  };

  // ユーザーデータの保存
  useEffect(() => {
    if (currentUser && !showOnboarding) {
      const userDataKey = `userData_${currentUser.username}`;
      const userData = {
        weightRecords,
        mealRecords,
        waterRecords,
        mentalRecords,
        fightDate,
        targetWeight,
        userProfile,
        onboardingCompleted: true
      };
      localStorage.setItem(userDataKey, JSON.stringify(userData));
    }
  }, [currentUser, weightRecords, mealRecords, waterRecords, mentalRecords, fightDate, targetWeight, userProfile, showOnboarding]);

  // 設定タブを開いた時に現在値をコピー
  useEffect(() => {
    if (activeTab === 'settings') {
      setTempFightDate(fightDate);
      setTempTargetWeight(targetWeight);
    }
  }, [activeTab]);

  // ログイン処理
  const handleLogin = () => {
    if (!loginForm.username || !loginForm.password) return;
    
    const usersKey = 'fighterApp_users';
    const users = JSON.parse(localStorage.getItem(usersKey) || '{}');
    
    if (users[loginForm.username] && users[loginForm.username].password === loginForm.password) {
      const user = { username: loginForm.username };
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setShowLogin(false);
      loadUserData(loginForm.username);
    } else {
      alert('ユーザー名またはパスワードが間違っています');
    }
  };

  // サインアップ処理
  const handleSignup = () => {
    if (!signupForm.username || !signupForm.password) {
      alert('ユーザー名とパスワードを入力してください');
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      alert('パスワードが一致しません');
      return;
    }
    
    const usersKey = 'fighterApp_users';
    const users = JSON.parse(localStorage.getItem(usersKey) || '{}');
    
    if (users[signupForm.username]) {
      alert('このユーザー名は既に使用されています');
      return;
    }
    
    users[signupForm.username] = { 
      password: signupForm.password,
      email: signupForm.email,
      subscribeNewsletter: signupForm.subscribeNewsletter
    };
    localStorage.setItem(usersKey, JSON.stringify(users));
    
    const user = { username: signupForm.username };
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setShowLogin(false);
    setIsSignup(false);
    setSignupForm({ username: '', password: '', confirmPassword: '', email: '', subscribeNewsletter: false });
    setShowOnboarding(true); // オンボーディングを表示
  };

  // ログアウト
  const handleLogout = () => {
    console.log('handleLogout called');
    console.log('Proceeding with logout...');
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setShowLogin(true);
    // データをリセット
    setWeightRecords([]);
    setMealRecords([]);
    setWaterRecords([]);
    setFightDate('');
    setTargetWeight('');
    setTodayWater(0);
    setShowLogoutConfirm(false);
    console.log('Logout complete');
  };

  // 設定を保存
  const handleSaveSettings = () => {
    setFightDate(tempFightDate);
    setTargetWeight(tempTargetWeight);
    setSettingsSaved(true);
    
    // 2秒後に元に戻す
    setTimeout(() => {
      setSettingsSaved(false);
    }, 2000);
  };

  // オンボーディング完了
  const completeOnboarding = () => {
    // データをプロフィールと設定に反映
    if (onboardingData.height) {
      setUserProfile(prev => ({
        ...prev,
        height: onboardingData.height,
        bodyFat: onboardingData.bodyFat,
        naturalWeight: onboardingData.currentWeight,
        sport: onboardingData.sport,
        gender: onboardingData.gender,
        experienceLevel: onboardingData.experienceLevel,
      }));
    }
    
    if (onboardingData.hasFight && onboardingData.fightDate) {
      setFightDate(onboardingData.fightDate);
      setTargetWeight(onboardingData.targetWeight);
    }
    
    // 初回体重記録を追加
    if (onboardingData.currentWeight) {
      const initialWeight = {
        date: new Date().toISOString().split('T')[0],
        weight: parseFloat(onboardingData.currentWeight),
        bodyFat: onboardingData.bodyFat ? parseFloat(onboardingData.bodyFat) : null,
        time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
      };
      setWeightRecords([initialWeight]);
    }
    
    setShowOnboarding(false);
    setOnboardingStep(0);
  };

  // 体重記録追加
  const addWeight = () => {
    if (!currentWeight) return;
    const newRecord = {
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(currentWeight),
      bodyFat: currentBodyFat ? parseFloat(currentBodyFat) : null,
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    };
    setWeightRecords([...weightRecords, newRecord]);
    setCurrentWeight('');
    setCurrentBodyFat('');
    setShowAddWeight(false);
  };

  // 食事記録追加（データベースから）
  const addFoodFromDatabase = () => {
    if (!selectedFood) return;
    
    const multiplier = foodAmount;
    const meal = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      name: `${selectedFood.name} × ${multiplier}`,
      calories: Math.round(selectedFood.calories * multiplier),
      protein: Math.round(selectedFood.protein * multiplier * 10) / 10,
      carbs: Math.round(selectedFood.carbs * multiplier * 10) / 10,
      fat: Math.round(selectedFood.fat * multiplier * 10) / 10,
    };
    
    setMealRecords([...mealRecords, meal]);
    setSelectedFood(null);
    setFoodAmount(1);
    setShowFoodSearch(false);
  };

  // 水分記録追加
  const addWater = (amount) => {
    const today = new Date().toISOString().split('T')[0];
    const newAmount = Math.max(0, todayWater + amount); // 0未満にならないように
    setTodayWater(newAmount);
    
    const existingIndex = waterRecords.findIndex(w => w.date === today);
    if (existingIndex >= 0) {
      const updated = [...waterRecords];
      updated[existingIndex].amount = newAmount;
      setWaterRecords(updated);
    } else {
      setWaterRecords([...waterRecords, { date: today, amount: newAmount }]);
    }
  };

  const deleteMeal = (id) => {
    setMealRecords(mealRecords.filter(m => m.id !== id));
  };

  const deleteWeight = (index) => {
    setWeightRecords(weightRecords.filter((_, i) => i !== index));
  };

  // メンタルチェック追加
  const addMentalCheck = (mood, note) => {
    const today = new Date().toISOString().split('T')[0];
    const newRecord = {
      id: Date.now(),
      date: today,
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      mood, // 1-5の数値
      note,
    };
    setMentalRecords([...mentalRecords, newRecord]);
    setShowMentalCheck(false);
  };

  // 今日のメンタルチェックを取得
  const getTodayMentalCheck = () => {
    const today = new Date().toISOString().split('T')[0];
    return mentalRecords.find(m => m.date === today);
  };

  // メンタルに応じたメッセージを生成
  const getMentalMessage = (mood) => {
    const messages = {
      5: [
        '最高の調子ですね！この勢いで突き進みましょう！💪',
        '素晴らしい！今日のトレーニングは特に効果的になりそうです🔥',
        'パーフェクト！あなたの努力が実を結んでいます✨',
      ],
      4: [
        '良い調子です！着実に前進していますよ👍',
        'いい感じですね。このペースを保ちましょう🎯',
        '順調です！あなたは正しい方向に進んでいます💫',
      ],
      3: [
        '普通の日もあります。無理せず、できることから始めましょう。',
        '悪くないです。小さな一歩も前進です🚶',
        '今日は体の声に耳を傾けて、適度に調整しましょう。',
      ],
      2: [
        '少し疲れていますね。休息も大切なトレーニングの一部です😌',
        '今日は無理をせず、回復に重点を置きましょう。',
        '辛い時こそ、自分を労わってください。明日はきっと良くなります🌅',
      ],
      1: [
        'とても辛いですね。今日は休息を最優先に考えてください💤',
        '無理は禁物です。心と体を休めることに集中しましょう。',
        'チャンピオンも休息日が必要です。今日はゆっくりしてください🛌',
      ],
    };
    const moodMessages = messages[mood] || messages[3];
    return moodMessages[Math.floor(Math.random() * moodMessages.length)];
  };

  // 適正階級診断ロジック
  const calculateOptimalWeightClass = () => {
    const { height, reach, bodyFat, wristSize, ankleSize, naturalWeight, gender, sport } = userProfile;
    
    if (!height || !bodyFat || !naturalWeight) {
      return null;
    }
    
    const h = parseFloat(height);
    const bf = parseFloat(bodyFat);
    const nw = parseFloat(naturalWeight);
    const r = reach ? parseFloat(reach) : h * 1.03; // リーチがない場合は身長×1.03で推定
    const wrist = wristSize ? parseFloat(wristSize) : 17; // デフォルト値
    const ankle = ankleSize ? parseFloat(ankleSize) : 23; // デフォルト値
    
    // 除脂肪体重を計算
    const leanMass = nw * (1 - bf / 100);
    
    // 骨格スコア（手首・足首の太さから骨格の大きさを推定）
    const frameScore = (wrist + ankle) / 2;
    
    // リーチ/身長比
    const reachRatio = r / h;
    
    // 理想的な競技体重を計算
    // 基本：除脂肪体重 + 適正脂肪（男性8-12%、女性15-20%）
    const targetBodyFat = gender === 'male' ? 10 : 17;
    const idealWeight = leanMass / (1 - targetBodyFat / 100);
    
    // リーチ補正：リーチが長い選手は少し重い階級でも有利
    const reachAdjustment = (reachRatio - 1.0) * 3;
    
    // 骨格補正：骨格が大きい選手はより重い階級が適正
    const frameAdjustment = (frameScore - 20) * 0.2;
    
    const adjustedWeight = idealWeight + reachAdjustment + frameAdjustment;
    
    // 階級を決定
    const classes = WEIGHT_CLASSES[sport][gender];
    const suitableClass = classes.find(c => adjustedWeight <= c.max && adjustedWeight > c.min);
    
    // 上下の階級も提示
    const classIndex = classes.findIndex(c => c.name === suitableClass?.name);
    const lowerClass = classIndex > 0 ? classes[classIndex - 1] : null;
    const upperClass = classIndex < classes.length - 1 ? classes[classIndex + 1] : null;
    
    return {
      recommended: suitableClass,
      lower: lowerClass,
      upper: upperClass,
      idealWeight: Math.round(adjustedWeight * 10) / 10,
      leanMass: Math.round(leanMass * 10) / 10,
      reachAdvantage: reachRatio > 1.02 ? 'リーチが長い' : reachRatio < 0.98 ? 'リーチが短い' : '標準的',
      frameSize: frameScore > 21 ? '大きい骨格' : frameScore < 19 ? '小さい骨格' : '中程度の骨格',
      reasoning: {
        leanMass: `除脂肪体重: ${Math.round(leanMass * 10) / 10}kg`,
        reachRatio: `リーチ/身長比: ${Math.round(reachRatio * 100) / 100}`,
        frameScore: `骨格スコア: ${Math.round(frameScore * 10) / 10}cm`,
        targetBF: `目標体脂肪率: ${targetBodyFat}%`,
      }
    };
  };

  // 統計データ
  const getDaysUntilFight = () => {
    if (!fightDate) return null;
    const today = new Date();
    const fight = new Date(fightDate);
    const diff = Math.ceil((fight - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getLatestWeight = () => {
    if (weightRecords.length === 0) return null;
    return weightRecords[weightRecords.length - 1].weight;
  };

  const getWeightToLose = () => {
    const latest = getLatestWeight();
    if (!latest || !targetWeight) return null;
    return (latest - parseFloat(targetWeight)).toFixed(1);
  };

  const getTodayCalories = () => {
    const today = new Date().toISOString().split('T')[0];
    return mealRecords
      .filter(m => m.date === today)
      .reduce((sum, m) => sum + m.calories, 0);
  };

  const getTodayMacros = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayMeals = mealRecords.filter(m => m.date === today);
    return {
      protein: todayMeals.reduce((sum, m) => sum + (m.protein || 0), 0),
      carbs: todayMeals.reduce((sum, m) => sum + (m.carbs || 0), 0),
      fat: todayMeals.reduce((sum, m) => sum + (m.fat || 0), 0),
    };
  };

  // 目標PFCを計算（目標体重ベース）
  const getTargetMacros = () => {
    if (!targetWeight) return null;
    const weight = parseFloat(targetWeight);
    // 減量期の推奨値：タンパク質 2.2g/kg、脂質 0.8g/kg、残りを炭水化物
    const protein = Math.round(weight * 2.2);
    const fat = Math.round(weight * 0.8);
    const proteinCal = protein * 4;
    const fatCal = fat * 9;
    // 総カロリーは目標体重 × 30kcal程度
    const totalCal = Math.round(weight * 30);
    const carbsCal = totalCal - proteinCal - fatCal;
    const carbs = Math.round(carbsCal / 4);
    return { protein, carbs, fat, calories: totalCal };
  };

  // グラフデータ
  const getWeightChartData = () => {
    return weightRecords.map(record => ({
      date: record.date,
      weight: record.weight,
      bodyFat: record.bodyFat || null
    }));
  };

  const getWaterChartData = (days = 7) => {
    const today = new Date();
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const record = waterRecords.find(w => w.date === dateStr);
      
      data.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        amount: record ? record.amount : 0
      });
    }
    
    return data;
  };

  // 食材検索とフィルター
  const getFilteredFoods = () => {
    const foods = FOOD_DATABASE[selectedCategory] || [];
    if (!foodSearchQuery) return foods;
    
    return foods.filter(food => 
      food.name.toLowerCase().includes(foodSearchQuery.toLowerCase())
    );
  };

  // ログイン画面
  // オンボーディング画面
  if (showOnboarding) {
    const totalSteps = 5;
    const progress = ((onboardingStep + 1) / totalSteps) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 p-4">
        <div className="max-w-2xl mx-auto py-8">
          {/* プログレスバー */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-semibold">WEIGHT COACH セットアップ</span>
              <span className="text-gray-400 text-sm">ステップ {onboardingStep + 1} / {totalSteps}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* ステップコンテンツ */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-red-900 min-h-[500px] flex flex-col">
            {onboardingStep === 0 && (
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-red-600 rounded-full mb-6">
                    <Award className="w-16 h-16 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">WEIGHT COACHへようこそ！</h2>
                  <p className="text-xl text-gray-300 mb-6">科学的な減量管理で、あなたの目標達成をサポートします</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4 bg-gray-700 rounded-lg p-4">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">精密な体重管理</h3>
                      <p className="text-gray-400 text-sm">水分補正機能で正確な体重推移を把握</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 bg-gray-700 rounded-lg p-4">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Utensils className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">栄養バランスの可視化</h3>
                      <p className="text-gray-400 text-sm">PFCバランスを円グラフで一目で確認</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 bg-gray-700 rounded-lg p-4">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">メンタルサポート</h3>
                      <p className="text-gray-400 text-sm">毎日のコンディションを記録して、コーチからアドバイス</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {onboardingStep === 1 && (
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4">あなたの目標は？</h2>
                <p className="text-gray-400 mb-8">WEIGHT COACHでどのような目標を達成したいですか？</p>
                
                <div className="space-y-3">
                  {[
                    { value: 'weight_cut', label: '減量（試合に向けて）', desc: '試合の計量に向けた科学的な減量管理' },
                    { value: 'build', label: '増量', desc: '筋肉を増やしながら体重を管理' },
                    { value: 'maintain', label: '体重維持', desc: '現在の体重をキープしながら体調管理' },
                  ].map(goal => (
                    <button
                      key={goal.value}
                      onClick={() => setOnboardingData({...onboardingData, goal: goal.value})}
                      className={`w-full text-left p-4 rounded-lg transition ${
                        onboardingData.goal === goal.value
                          ? 'bg-red-600 border-2 border-red-400'
                          : 'bg-gray-700 border-2 border-transparent hover:border-red-500'
                      }`}
                    >
                      <div className="text-white font-semibold mb-1">{goal.label}</div>
                      <div className="text-sm text-gray-300">{goal.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {onboardingStep === 2 && (
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4">基本情報を入力</h2>
                <p className="text-gray-400 mb-8">あなたの体の情報を教えてください</p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">性別</label>
                      <select
                        value={onboardingData.gender}
                        onChange={(e) => setOnboardingData({...onboardingData, gender: e.target.value})}
                        className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="male">男性</option>
                        <option value="female">女性</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">競技</label>
                      <select
                        value={onboardingData.sport}
                        onChange={(e) => setOnboardingData({...onboardingData, sport: e.target.value})}
                        className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="boxing">ボクシング</option>
                        <option value="kickboxing">キックボクシング</option>
                        <option value="mma">総合格闘技</option>
                        <option value="judo">柔道</option>
                        <option value="wrestling">レスリング</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">身長 (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="170"
                        value={onboardingData.height}
                        onChange={(e) => setOnboardingData({...onboardingData, height: e.target.value})}
                        className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">現在の体重 (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="70"
                        value={onboardingData.currentWeight}
                        onChange={(e) => setOnboardingData({...onboardingData, currentWeight: e.target.value})}
                        className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">体脂肪率 (%) ※推定でOK</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="15"
                      value={onboardingData.bodyFat}
                      onChange={(e) => setOnboardingData({...onboardingData, bodyFat: e.target.value})}
                      className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {onboardingStep === 3 && (
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4">試合の予定はありますか？</h2>
                <p className="text-gray-400 mb-8">試合日を設定すると、カウントダウンが表示されます</p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setOnboardingData({...onboardingData, hasFight: true})}
                      className={`p-6 rounded-lg transition ${
                        onboardingData.hasFight === true
                          ? 'bg-red-600 border-2 border-red-400'
                          : 'bg-gray-700 border-2 border-transparent hover:border-red-500'
                      }`}
                    >
                      <div className="text-white font-semibold text-lg">はい</div>
                    </button>
                    
                    <button
                      onClick={() => setOnboardingData({...onboardingData, hasFight: false, fightDate: '', targetWeight: ''})}
                      className={`p-6 rounded-lg transition ${
                        onboardingData.hasFight === false
                          ? 'bg-red-600 border-2 border-red-400'
                          : 'bg-gray-700 border-2 border-transparent hover:border-red-500'
                      }`}
                    >
                      <div className="text-white font-semibold text-lg">いいえ</div>
                    </button>
                  </div>
                  
                  {onboardingData.hasFight && (
                    <div className="space-y-4 mt-6">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">試合日</label>
                        <input
                          type="date"
                          value={onboardingData.fightDate}
                          onChange={(e) => setOnboardingData({...onboardingData, fightDate: e.target.value})}
                          className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">目標体重 (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="65"
                          value={onboardingData.targetWeight}
                          onChange={(e) => setOnboardingData({...onboardingData, targetWeight: e.target.value})}
                          className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {onboardingStep === 4 && (
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4">経験レベルは？</h2>
                <p className="text-gray-400 mb-8">あなたの競技経験を教えてください</p>
                
                <div className="space-y-3">
                  {[
                    { value: 'beginner', label: '初心者', desc: '競技歴 1年未満' },
                    { value: 'intermediate', label: '中級者', desc: '競技歴 1-3年' },
                    { value: 'advanced', label: '上級者', desc: '競技歴 3年以上' },
                    { value: 'pro', label: 'プロ', desc: 'プロライセンス保持' },
                  ].map(level => (
                    <button
                      key={level.value}
                      onClick={() => setOnboardingData({...onboardingData, experienceLevel: level.value})}
                      className={`w-full text-left p-4 rounded-lg transition ${
                        onboardingData.experienceLevel === level.value
                          ? 'bg-red-600 border-2 border-red-400'
                          : 'bg-gray-700 border-2 border-transparent hover:border-red-500'
                      }`}
                    >
                      <div className="text-white font-semibold mb-1">{level.label}</div>
                      <div className="text-sm text-gray-300">{level.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* ナビゲーションボタン */}
            <div className="flex gap-3 mt-8">
              {onboardingStep > 0 && (
                <button
                  onClick={() => setOnboardingStep(onboardingStep - 1)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition"
                >
                  戻る
                </button>
              )}
              
              <button
                onClick={() => {
                  if (onboardingStep < totalSteps - 1) {
                    // バリデーション
                    if (onboardingStep === 1 && !onboardingData.goal) {
                      return;
                    }
                    if (onboardingStep === 2 && (!onboardingData.height || !onboardingData.currentWeight || !onboardingData.bodyFat)) {
                      return;
                    }
                    if (onboardingStep === 3 && onboardingData.hasFight === null) {
                      return;
                    }
                    if (onboardingStep === 3 && onboardingData.hasFight && (!onboardingData.fightDate || !onboardingData.targetWeight)) {
                      return;
                    }
                    if (onboardingStep === 4 && !onboardingData.experienceLevel) {
                      return;
                    }
                    setOnboardingStep(onboardingStep + 1);
                  } else {
                    completeOnboarding();
                  }
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition"
              >
                {onboardingStep < totalSteps - 1 ? '次へ' : '完了'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-red-900">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-4">
              <Award className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">WEIGHT COACH</h1>
            <p className="text-gray-400">科学的な減量管理とメンタルサポート</p>
          </div>
          
          {!isSignup ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="ユーザー名"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="password"
                placeholder="パスワード"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={handleLogin}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
              >
                ログイン
              </button>
              <button
                onClick={() => setIsSignup(true)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition"
              >
                新規登録
              </button>
              
              {/* デバッグ用 */}
              <button
                onClick={() => {
                  const usersKey = 'fighterApp_users';
                  const users = JSON.parse(localStorage.getItem(usersKey) || '{}');
                  users['test'] = { password: 'test', email: '', subscribeNewsletter: false };
                  localStorage.setItem(usersKey, JSON.stringify(users));
                  alert('テストユーザー作成完了\nユーザー名: test\nパスワード: test');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition"
              >
                🔧 テストユーザー作成
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="ユーザー名"
                value={signupForm.username}
                onChange={(e) => setSignupForm({...signupForm, username: e.target.value})}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="email"
                placeholder="メールアドレス（任意）"
                value={signupForm.email}
                onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="password"
                placeholder="パスワード"
                value={signupForm.password}
                onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="password"
                placeholder="パスワード確認"
                value={signupForm.confirmPassword}
                onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              
              {/* メールマガジン */}
              <label className="flex items-start gap-3 cursor-pointer bg-gray-800 rounded-lg p-3">
                <input
                  type="checkbox"
                  checked={signupForm.subscribeNewsletter}
                  onChange={(e) => setSignupForm({...signupForm, subscribeNewsletter: e.target.checked})}
                  className="mt-1 w-5 h-5"
                />
                <div>
                  <div className="text-white font-medium text-sm">メールマガジンを受け取る</div>
                  <div className="text-xs text-gray-400 mt-1">減量のコツ、新機能のお知らせ</div>
                </div>
              </label>
              
              <button
                onClick={handleSignup}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
              >
                登録
              </button>
              <button
                onClick={() => setIsSignup(false)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition"
              >
                ログインに戻る
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">WEIGHT COACH</h1>
              <p className="text-sm text-red-200">@{currentUser?.username}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="bg-red-900 hover:bg-red-950 p-2 rounded-lg"
            style={{ cursor: 'pointer' }}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4">
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            {/* 試合までのカウントダウン */}
            {fightDate && (
              <div className="bg-gradient-to-br from-red-900 to-red-950 rounded-xl p-6 border-2 border-red-500 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-300 mb-1">試合まで</div>
                    <div className="text-6xl font-bold text-red-400 mb-2">
                      {getDaysUntilFight()}
                      <span className="text-2xl ml-2">日</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(fightDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <Calendar className="w-20 h-20 text-red-400 opacity-30" />
                </div>
              </div>
            )}

            {/* メンタルチェック */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-600">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-gray-400" />
                <span className="font-semibold">今日の調子</span>
              </div>
              {(() => {
                const todayCheck = getTodayMentalCheck();
                if (todayCheck) {
                  const moodEmojis = ['😢', '😔', '😐', '🙂', '😄'];
                  return (
                    <div>
                      <div className="text-sm text-gray-400 mb-1">コーチからのメッセージ</div>
                      <div className="bg-gray-700 rounded-lg p-3 mb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-3xl">{moodEmojis[todayCheck.mood - 1]}</span>
                          <span className="text-sm text-gray-400">{todayCheck.time}</span>
                        </div>
                        <p className="text-white">{getMentalMessage(todayCheck.mood)}</p>
                        {todayCheck.note && (
                          <p className="text-sm text-gray-400 mt-2 italic">「{todayCheck.note}」</p>
                        )}
                      </div>
                    </div>
                  );
                }
                return (
                  <button
                    onClick={() => setShowMentalCheck(true)}
                    className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg transition"
                  >
                    <div className="text-sm text-gray-400">コーチがあなたをサポートします</div>
                    <div className="text-white font-semibold mt-1">今日の調子を記録する</div>
                  </button>
                );
              })()}
            </div>

            {/* 体重情報 */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <Scale className="w-3 h-3" />
                  現在
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  {getLatestWeight() ? `${getLatestWeight()}kg` : '---'}
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  目標
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {targetWeight ? `${targetWeight}kg` : '---'}
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  残り
                </div>
                <div className="text-2xl font-bold text-yellow-400">
                  {getWeightToLose() ? `-${getWeightToLose()}kg` : '---'}
                </div>
              </div>
            </div>

            {/* 今日の栄養摂取 */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-orange-400" />
                  <span className="font-semibold">今日の栄養</span>
                </div>
                <div className="text-2xl font-bold text-orange-400">
                  {getTodayCalories()} <span className="text-sm">kcal</span>
                </div>
              </div>
              
              {/* 円グラフとマクロの表示 */}
              <div className="grid grid-cols-2 gap-4">
                {/* 円グラフ */}
                <div className="flex items-center justify-center">
                  {(() => {
                    const macros = getTodayMacros();
                    const total = macros.protein + macros.carbs + macros.fat;
                    if (total === 0) {
                      return (
                        <div className="text-center text-gray-500 text-sm">
                          <Utensils className="w-12 h-12 mx-auto mb-2 opacity-30" />
                          <div className="text-xs">まだ記録なし</div>
                        </div>
                      );
                    }
                    const data = [
                      { name: 'タンパク質', value: macros.protein, color: '#EF4444' },
                      { name: '炭水化物', value: macros.carbs, color: '#FBBF24' },
                      { name: '脂質', value: macros.fat, color: '#10B981' },
                    ];
                    return (
                      <ResponsiveContainer width="100%" height={120}>
                        <PieChart>
                          <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                            formatter={(value) => `${Math.round(value)}g`}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    );
                  })()}
                </div>
                
                {/* マクロ詳細 */}
                <div className="flex flex-col justify-center space-y-2 text-sm">
                  {(() => {
                    const target = getTargetMacros();
                    const current = getTodayMacros();
                    return (
                      <>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-gray-400">タンパク質</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-red-400">{Math.round(current.protein)}g</span>
                            {target && <span className="text-xs text-gray-500 ml-1">/ {target.protein}g</span>}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-gray-400">炭水化物</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-yellow-400">{Math.round(current.carbs)}g</span>
                            {target && <span className="text-xs text-gray-500 ml-1">/ {target.carbs}g</span>}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-400">脂質</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-green-400">{Math.round(current.fat)}g</span>
                            {target && <span className="text-xs text-gray-500 ml-1">/ {target.fat}g</span>}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
              {(() => {
                const target = getTargetMacros();
                if (target) {
                  return (
                    <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400">
                      💡 目標: {target.calories}kcal/日（減量期の推奨値）
                    </div>
                  );
                }
              })()}
            </div>

            {/* 水分摂取 */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold">今日の水分</span>
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  {todayWater} <span className="text-sm">ml</span>
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => addWater(250)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  250ml
                </button>
                <button
                  onClick={() => addWater(500)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  500ml
                </button>
                <button
                  onClick={() => addWater(-250)}
                  disabled={todayWater === 0}
                  className="px-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 py-2 rounded-lg transition flex items-center justify-center"
                  title="250ml減らす"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
              
              {/* 水分摂取グラフ */}
              <div className="mt-4">
                <div className="text-sm text-gray-400 mb-2">過去7日間の水分摂取</div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={getWaterChartData(7)}>
                    <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                      formatter={(value) => [`${value}ml`, '水分']}
                    />
                    <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 体重推移グラフ */}
            {getWeightChartData().length > 0 && (
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-400" />
                  体重・体脂肪率推移
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={getWeightChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis 
                      yAxisId="weight"
                      stroke="#3B82F6"
                      tick={{ fontSize: 11 }}
                      domain={['dataMin - 2', 'dataMax + 2']}
                    />
                    <YAxis 
                      yAxisId="bodyFat"
                      orientation="right"
                      stroke="#10B981"
                      tick={{ fontSize: 11 }}
                      domain={[0, 40]}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                    />
                    <Legend />
                    {targetWeight && (
                      <ReferenceLine 
                        yAxisId="weight"
                        y={parseFloat(targetWeight)} 
                        stroke="#10B981" 
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        label={{ value: '目標', fill: '#10B981', fontSize: 12, position: 'right' }}
                      />
                    )}
                    <Line 
                      yAxisId="weight"
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', r: 5 }}
                      activeDot={{ r: 7 }}
                      name="体重(kg)"
                    />
                    <Line 
                      yAxisId="bodyFat"
                      type="monotone" 
                      dataKey="bodyFat" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ fill: '#10B981', r: 4 }}
                      connectNulls
                      name="体脂肪率(%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {activeTab === 'weight' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">体重記録</h2>
              <button
                onClick={() => setShowAddWeight(!showAddWeight)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <Plus className="w-5 h-5" />
                記録
              </button>
            </div>

            {showAddWeight && (
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <input
                  type="number"
                  step="0.1"
                  placeholder="体重 (kg)"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 mb-3 text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="体脂肪率 (%) ※任意"
                  value={currentBodyFat}
                  onChange={(e) => setCurrentBodyFat(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 mb-3 text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={addWeight}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition"
                >
                  追加
                </button>
              </div>
            )}

            <div className="space-y-2">
              {weightRecords.slice().reverse().map((record, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-4 flex justify-between items-center border border-gray-700">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{record.weight} kg</div>
                    {record.bodyFat && (
                      <div className="text-lg text-green-400">体脂肪率: {record.bodyFat}%</div>
                    )}
                    <div className="text-sm text-gray-400">{record.date} {record.time}</div>
                  </div>
                  <button
                    onClick={() => deleteWeight(weightRecords.length - 1 - index)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'meals' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">食事記録</h2>
              <button
                onClick={() => setShowFoodSearch(!showFoodSearch)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <Plus className="w-5 h-5" />
                記録
              </button>
            </div>

            {showFoodSearch && (
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-4">
                {/* カテゴリー選択 */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {[
                    { key: 'proteins', label: 'タンパク質', icon: '🥩' },
                    { key: 'carbs', label: '炭水化物', icon: '🍚' },
                    { key: 'vegetables', label: '野菜', icon: '🥦' },
                    { key: 'convenience', label: 'コンビニ', icon: '🏪' },
                    { key: 'restaurants', label: '外食', icon: '🍽️' },
                  ].map(cat => (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                        selectedCategory === cat.key
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>

                {/* 検索 */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="食材を検索..."
                    value={foodSearchQuery}
                    onChange={(e) => setFoodSearchQuery(e.target.value)}
                    className="w-full bg-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* 食材リスト */}
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {getFilteredFoods().map(food => (
                    <button
                      key={food.id}
                      onClick={() => setSelectedFood(food)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        selectedFood?.id === food.id
                          ? 'bg-red-600 border-2 border-red-400'
                          : 'bg-gray-700 hover:bg-gray-600 border-2 border-transparent'
                      }`}
                    >
                      <div className="font-semibold">{food.name}</div>
                      <div className="text-sm text-gray-300 mt-1">
                        {food.calories}kcal | P:{food.protein}g C:{food.carbs}g F:{food.fat}g
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{food.unit}</div>
                    </button>
                  ))}
                </div>

                {/* 選択した食材の量設定 */}
                {selectedFood && (
                  <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                    <div className="font-semibold text-lg">{selectedFood.name}</div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gray-300">数量:</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={foodAmount}
                        onChange={(e) => setFoodAmount(parseFloat(e.target.value) || 1)}
                        className="bg-gray-600 rounded-lg px-3 py-2 w-20 text-center focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-400">× {selectedFood.unit}</span>
                    </div>
                    <div className="bg-gray-600 rounded-lg p-3">
                      <div className="text-sm text-gray-300">合計栄養素:</div>
                      <div className="grid grid-cols-4 gap-2 mt-2 text-center">
                        <div>
                          <div className="text-xs text-gray-400">カロリー</div>
                          <div className="font-bold text-orange-400">{Math.round(selectedFood.calories * foodAmount)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">P</div>
                          <div className="font-bold text-red-400">{Math.round(selectedFood.protein * foodAmount * 10) / 10}g</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">C</div>
                          <div className="font-bold text-yellow-400">{Math.round(selectedFood.carbs * foodAmount * 10) / 10}g</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">F</div>
                          <div className="font-bold text-green-400">{Math.round(selectedFood.fat * foodAmount * 10) / 10}g</div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={addFoodFromDatabase}
                      className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition"
                    >
                      追加
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 食事履歴 */}
            <div className="space-y-2">
              {mealRecords.slice().reverse().map((meal) => (
                <div key={meal.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{meal.name}</div>
                      <div className="text-sm text-gray-400">{meal.date} {meal.time}</div>
                    </div>
                    <button
                      onClick={() => deleteMeal(meal.id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="bg-gray-700 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-400">kcal</div>
                      <div className="font-bold text-orange-400">{meal.calories}</div>
                    </div>
                    {meal.protein !== undefined && (
                      <>
                        <div className="bg-gray-700 rounded-lg p-2 text-center">
                          <div className="text-xs text-gray-400">P</div>
                          <div className="font-bold text-red-400">{meal.protein}g</div>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-2 text-center">
                          <div className="text-xs text-gray-400">C</div>
                          <div className="font-bold text-yellow-400">{meal.carbs}g</div>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-2 text-center">
                          <div className="text-xs text-gray-400">F</div>
                          <div className="font-bold text-green-400">{meal.fat}g</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <User className="w-6 h-6" />
              プロフィール設定
            </h2>
            
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-4">
              {/* 基本情報 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b border-gray-700 pb-2">基本情報</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">性別</label>
                    <select
                      value={userProfile.gender}
                      onChange={(e) => setUserProfile({...userProfile, gender: e.target.value})}
                      className="w-full bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="male">男性</option>
                      <option value="female">女性</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">競技</label>
                    <select
                      value={userProfile.sport}
                      onChange={(e) => setUserProfile({...userProfile, sport: e.target.value})}
                      className="w-full bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="boxing">ボクシング</option>
                      <option value="kickboxing">キックボクシング</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 身体データ */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b border-gray-700 pb-2">身体データ</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1 flex items-center gap-1">
                      <Ruler className="w-4 h-4" />
                      身長 (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={userProfile.height}
                      onChange={(e) => setUserProfile({...userProfile, height: e.target.value})}
                      className="w-full bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">リーチ (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={userProfile.reach}
                      onChange={(e) => setUserProfile({...userProfile, reach: e.target.value})}
                      className="w-full bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="例: 175"
                    />
                    <p className="text-xs text-gray-500 mt-1">※両腕を広げた時の指先から指先までの長さ</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1 flex items-center gap-1">
                      <Percent className="w-4 h-4" />
                      体脂肪率 (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={userProfile.bodyFat}
                      onChange={(e) => setUserProfile({...userProfile, bodyFat: e.target.value})}
                      className="w-full bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1 flex items-center gap-1">
                      <Scale className="w-4 h-4" />
                      自然体重 (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={userProfile.naturalWeight}
                      onChange={(e) => setUserProfile({...userProfile, naturalWeight: e.target.value})}
                      className="w-full bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="例: 70"
                    />
                    <p className="text-xs text-gray-500 mt-1">※トレーニングをしていない時の普段の体重</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">手首周り (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={userProfile.wristSize}
                      onChange={(e) => setUserProfile({...userProfile, wristSize: e.target.value})}
                      placeholder="16-18cm程度"
                      className="w-full bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">足首周り (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={userProfile.ankleSize}
                      onChange={(e) => setUserProfile({...userProfile, ankleSize: e.target.value})}
                      placeholder="22-24cm程度"
                      className="w-full bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* 適正階級診断ボタン */}
              <button
                onClick={() => setShowClassDiagnosis(true)}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition shadow-lg"
              >
                <Target className="w-6 h-6" />
                適正階級を診断する
              </button>

              {/* 将来のソーシャル機能用（グレーアウト） */}
              <div className="space-y-3 opacity-50">
                <h3 className="font-semibold text-lg border-b border-gray-700 pb-2">プロフィール（開発中）</h3>
                <input
                  type="text"
                  placeholder="表示名"
                  disabled
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 cursor-not-allowed"
                />
                <input
                  type="text"
                  placeholder="所属ジム"
                  disabled
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 cursor-not-allowed"
                />
                <textarea
                  placeholder="自己紹介"
                  disabled
                  rows="3"
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">設定</h2>
            
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">試合日</label>
                <input
                  type="date"
                  value={tempFightDate}
                  onChange={(e) => setTempFightDate(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">目標体重 (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tempTargetWeight}
                  onChange={(e) => setTempTargetWeight(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              {/* 保存ボタン */}
              <button
                onClick={handleSaveSettings}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  settingsSaved 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {settingsSaved ? '✅ 保存しました！' : '設定を保存'}
              </button>

              <div className="pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500 mb-3">
                  ※ログアウトは画面右上のボタンから行えます
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (confirm('⚠️ 全データを削除しますか？\n\nこの操作は取り消せません。')) {
                      if (confirm('本当によろしいですか？')) {
                        const userDataKey = `userData_${currentUser.username}`;
                        localStorage.removeItem(userDataKey);
                        setWeightRecords([]);
                        setMealRecords([]);
                        setWaterRecords([]);
                        setMentalRecords([]);
                        setFightDate('');
                        setTargetWeight('');
                        setTodayWater(0);
                        setUserProfile({
                          height: '',
                          reach: '',
                          bodyFat: '',
                          wristSize: '',
                          ankleSize: '',
                          naturalWeight: '',
                          gender: 'male',
                          sport: 'boxing',
                          displayName: '',
                          gym: '',
                          record: { wins: 0, losses: 0, draws: 0 },
                          bio: '',
                          favoriteStyle: '',
                        });
                        alert('全データをリセットしました');
                      }
                    }
                  }}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-red-400 py-2 text-sm rounded-lg transition border border-gray-700"
                >
                  データをリセット
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 適正階級診断モーダル */}
      {showClassDiagnosis && (() => {
        const diagnosis = calculateOptimalWeightClass();
        return (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border-2 border-red-500">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Target className="w-8 h-8 text-red-400" />
                  適正階級診断結果
                </h2>
                <button
                  onClick={() => setShowClassDiagnosis(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              {!diagnosis ? (
                <div className="text-center py-8">
                  <Info className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-300">
                    診断には以下のデータが必要です：
                  </p>
                  <ul className="text-left mt-4 space-y-2 text-gray-400 max-w-sm mx-auto">
                    <li>• 身長</li>
                    <li>• 体脂肪率</li>
                    <li>• 自然体重（トレーニングしていない時の体重）</li>
                  </ul>
                  <button
                    onClick={() => {
                      setShowClassDiagnosis(false);
                      setActiveTab('profile');
                    }}
                    className="mt-6 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
                  >
                    プロフィールを設定する
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* 推奨階級 */}
                  <div className="bg-gradient-to-br from-red-900 to-red-950 rounded-xl p-6 border-2 border-red-400">
                    <div className="text-center">
                      <div className="text-sm text-gray-300 mb-2">あなたの適正階級</div>
                      <div className="text-4xl font-bold text-red-400 mb-4">
                        {diagnosis.recommended.name}
                      </div>
                      <div className="text-xl text-gray-300">
                        理想競技体重: <span className="font-bold text-white">{diagnosis.idealWeight}kg</span>
                      </div>
                    </div>
                  </div>

                  {/* 他の選択肢 */}
                  <div className="grid grid-cols-2 gap-3">
                    {diagnosis.lower && (
                      <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
                        <div className="text-xs text-gray-400 mb-1">1つ下の階級</div>
                        <div className="text-lg font-bold text-yellow-400">{diagnosis.lower.name}</div>
                        <div className="text-xs text-gray-400 mt-1">より厳しい減量が必要</div>
                      </div>
                    )}
                    {diagnosis.upper && (
                      <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
                        <div className="text-xs text-gray-400 mb-1">1つ上の階級</div>
                        <div className="text-lg font-bold text-green-400">{diagnosis.upper.name}</div>
                        <div className="text-xs text-gray-400 mt-1">余裕を持った減量</div>
                      </div>
                    )}
                  </div>

                  {/* 診断根拠 */}
                  <div className="bg-gray-700 rounded-xl p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-400" />
                      診断の根拠
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-600">
                        <span className="text-gray-300">除脂肪体重</span>
                        <span className="font-bold text-blue-400">{diagnosis.leanMass}kg</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-600">
                        <span className="text-gray-300">リーチの特徴</span>
                        <span className="font-bold text-purple-400">{diagnosis.reachAdvantage}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-600">
                        <span className="text-gray-300">骨格の大きさ</span>
                        <span className="font-bold text-green-400">{diagnosis.frameSize}</span>
                      </div>
                    </div>
                  </div>

                  {/* 詳細データ */}
                  <div className="bg-gray-700 rounded-xl p-4">
                    <h3 className="font-semibold mb-3 text-sm text-gray-400">詳細データ</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(diagnosis.reasoning).map(([key, value]) => (
                        <div key={key} className="bg-gray-600 rounded p-2">
                          <div className="text-gray-400">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 説明 */}
                  <div className="bg-blue-900 bg-opacity-30 rounded-xl p-4 border border-blue-800">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      この診断は、あなたの除脂肪体重、リーチ、骨格の大きさを総合的に分析して算出しています。
                      推奨階級では最も高いパフォーマンスを発揮でき、健康的な減量が可能です。
                    </p>
                  </div>

                  <button
                    onClick={() => setShowClassDiagnosis(false)}
                    className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition"
                  >
                    閉じる
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ボトムナビゲーション */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 flex shadow-2xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-3 flex flex-col items-center gap-1 transition ${
            activeTab === 'dashboard' ? 'text-red-400 bg-gray-700' : 'text-gray-400'
          }`}
        >
          <Target className="w-6 h-6" />
          <span className="text-xs">ホーム</span>
        </button>
        <button
          onClick={() => setActiveTab('weight')}
          className={`flex-1 py-3 flex flex-col items-center gap-1 transition ${
            activeTab === 'weight' ? 'text-red-400 bg-gray-700' : 'text-gray-400'
          }`}
        >
          <TrendingDown className="w-6 h-6" />
          <span className="text-xs">体重</span>
        </button>
        <button
          onClick={() => setActiveTab('meals')}
          className={`flex-1 py-3 flex flex-col items-center gap-1 transition ${
            activeTab === 'meals' ? 'text-red-400 bg-gray-700' : 'text-gray-400'
          }`}
        >
          <Utensils className="w-6 h-6" />
          <span className="text-xs">食事</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-3 flex flex-col items-center gap-1 transition ${
            activeTab === 'profile' ? 'text-red-400 bg-gray-700' : 'text-gray-400'
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs">診断</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 flex flex-col items-center gap-1 transition ${
            activeTab === 'settings' ? 'text-red-400 bg-gray-700' : 'text-gray-400'
          }`}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs">設定</span>
        </button>
      </div>
      
      {/* メンタルチェックモーダル */}
      {showMentalCheck && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6 border-2 border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Activity className="w-8 h-8 text-gray-400" />
                今日の調子
              </h2>
              <button
                onClick={() => setShowMentalCheck(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <p className="text-gray-300 text-sm mb-6">あなたのコンディションを教えてください。コーチがサポートします。</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-2">
                {[
                  { emoji: '😄', label: '最高', value: 5 },
                  { emoji: '🙂', label: '良い', value: 4 },
                  { emoji: '😐', label: '普通', value: 3 },
                  { emoji: '😔', label: '疲れ', value: 2 },
                  { emoji: '😢', label: '辛い', value: 1 },
                ].map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => {
                      const note = prompt('メモ（任意）:');
                      addMentalCheck(mood.value, note || '');
                    }}
                    className="bg-gray-700 hover:bg-gray-600 rounded-xl p-3 transition flex flex-col items-center gap-1"
                  >
                    <span className="text-3xl">{mood.emoji}</span>
                    <span className="text-xs text-gray-400">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* ログアウト確認モーダル */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl max-w-sm w-full p-6 border-2 border-red-500">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <LogOut className="w-8 h-8 text-red-400" />
              ログアウト
            </h2>
            <p className="text-gray-300 mb-6">ログアウトしますか？</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-semibold transition"
              >
                キャンセル
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FighterWeightApp;

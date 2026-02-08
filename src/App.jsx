import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { Calendar, TrendingDown, Droplet, Utensils, Plus, Trash2, Target, Award, User, LogOut, Search, Info, Activity, Scale, Ruler, Percent, Users, Minus, BookHeart, MessageSquare, ArrowRight } from 'lucide-react';

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
    { id: 20, name: 'ゆで卵', calories: 151, protein: 12.3, carbs: 0.3, fat: 10.3, unit: '1個（50g）' },
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
  const [signupForm, setSignupForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [isSignup, setIsSignup] = useState(false);
  
  // 既存の状態
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weightRecords, setWeightRecords] = useState([]);
  const [mealRecords, setMealRecords] = useState([]);
  const [waterRecords, setWaterRecords] = useState([]);
  const [fightDate, setFightDate] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [todayWater, setTodayWater] = useState(0);
  
  // 新機能の状態
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('proteins');
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodAmount, setFoodAmount] = useState(1);
  const [showClassDiagnosis, setShowClassDiagnosis] = useState(false);
  
  // メンタルチェック
  const [showMentalCheck, setShowMentalCheck] = useState(false);
  const [mentalRecords, setMentalRecords] = useState([]);
  
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
    }
  };

  // ユーザーデータの保存
  useEffect(() => {
    if (currentUser) {
      const userDataKey = `userData_${currentUser.username}`;
      const userData = {
        weightRecords,
        mealRecords,
        waterRecords,
        mentalRecords,
        fightDate,
        targetWeight,
        userProfile
      };
      localStorage.setItem(userDataKey, JSON.stringify(userData));
    }
  }, [currentUser, weightRecords, mealRecords, waterRecords, mentalRecords, fightDate, targetWeight, userProfile]);

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
    
    users[signupForm.username] = { password: signupForm.password };
    localStorage.setItem(usersKey, JSON.stringify(users));
    
    const user = { username: signupForm.username };
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setShowLogin(false);
    setIsSignup(false);
  };

  // ログアウト
  const handleLogout = () => {
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
  };

  // 体重記録追加
  const addWeight = () => {
    if (!currentWeight) return;
    const newRecord = {
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(currentWeight),
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    };
    setWeightRecords([...weightRecords, newRecord]);
    setCurrentWeight('');
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

  // グラフデータ
  const getWeightChartData = () => {
    return weightRecords.map(record => ({
      date: record.date,
      weight: record.weight
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
            onClick={handleLogout}
            className="bg-red-900 hover:bg-red-950 p-2 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4">
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            {/* メンタルチェック */}
            {(() => {
              const todayMental = getTodayMentalCheck();
              return todayMental ? (
                <div className="bg-gray-800 rounded-xl p-4 border-2 border-gray-600">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                      {todayMental.mood === 5 ? '😄' : todayMental.mood === 4 ? '🙂' : todayMental.mood === 3 ? '😐' : todayMental.mood === 2 ? '😔' : '😢'}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-400 mb-1">コーチからのメッセージ</div>
                      <div className="text-white font-semibold">{getMentalMessage(todayMental.mood)}</div>
                      {todayMental.note && (
                        <div className="text-sm text-gray-300 mt-2 bg-gray-700 bg-opacity-50 rounded-lg p-2">
                          「{todayMental.note}」
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowMentalCheck(true)}
                  className="w-full bg-gray-800 rounded-xl p-4 border-2 border-gray-600 hover:border-gray-500 transition"
                >
                  <div className="flex items-center gap-3">
                    <BookHeart className="w-6 h-6 text-gray-400" />
                    <div className="text-left flex-1">
                      <div className="font-semibold text-white">今日の調子はどうですか？</div>
                      <div className="text-sm text-gray-400">コーチがあなたをサポートします</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              );
            })()}

            {/* 試合までのカウントダウン - 改善版 */}
            {fightDate && (
              <div className="bg-gray-800 rounded-xl p-6 border-2 border-red-900 shadow-xl relative overflow-hidden">
                {/* 背景の装飾 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-900 opacity-20 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-900 opacity-20 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <Target className="w-5 h-5" />
                        <span className="text-sm font-semibold">FIGHT DAY</span>
                      </div>
                      <div className="text-4xl font-black text-red-500 mb-2">
                        試合まであと<span className="text-6xl mx-2">{getDaysUntilFight()}</span>日
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(fightDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="text-right">
                      <Award className="w-16 h-16 text-red-900 opacity-30 mb-2" />
                      {(() => {
                        const days = getDaysUntilFight();
                        if (days <= 7) return <div className="text-xs text-red-400 font-bold">🔥 最終週</div>;
                        if (days <= 14) return <div className="text-xs text-orange-400 font-bold">⚡ ラストスパート</div>;
                        if (days <= 30) return <div className="text-xs text-yellow-400 font-bold">💪 調整期</div>;
                        return <div className="text-xs text-gray-400 font-bold">📈 準備期</div>;
                      })()}
                    </div>
                  </div>
                  
                  {/* プログレスバー */}
                  {(() => {
                    const days = getDaysUntilFight();
                    const totalDays = 90;
                    const progress = Math.max(0, Math.min(100, ((totalDays - days) / totalDays) * 100));
                    return (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>準備開始</span>
                          <span>試合当日</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-600 transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

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
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-400">タンパク質</span>
                    </div>
                    <span className="font-bold text-red-400">{Math.round(getTodayMacros().protein)}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-400">炭水化物</span>
                    </div>
                    <span className="font-bold text-yellow-400">{Math.round(getTodayMacros().carbs)}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-400">脂質</span>
                    </div>
                    <span className="font-bold text-green-400">{Math.round(getTodayMacros().fat)}g</span>
                  </div>
                </div>
              </div>
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
                  体重推移
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
                      stroke="#9CA3AF"
                      tick={{ fontSize: 11 }}
                      domain={['dataMin - 2', 'dataMax + 2']}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                      formatter={(value) => [`${value}kg`, '体重']}
                    />
                    {targetWeight && (
                      <ReferenceLine 
                        y={parseFloat(targetWeight)} 
                        stroke="#10B981" 
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        label={{ value: '目標', fill: '#10B981', fontSize: 12, position: 'right' }}
                      />
                    )}
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', r: 5 }}
                      activeDot={{ r: 7 }}
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
                    />
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
                    />
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
                  value={fightDate}
                  onChange={(e) => setFightDate(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">目標体重 (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    if (confirm('このユーザーの全データを削除しますか？')) {
                      const userDataKey = `userData_${currentUser.username}`;
                      localStorage.removeItem(userDataKey);
                      setWeightRecords([]);
                      setMealRecords([]);
                      setWaterRecords([]);
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
                    }
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition"
                >
                  全データをリセット
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

      {/* メンタルチェックモーダル */}
      {showMentalCheck && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6 border-2 border-gray-600">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">今日の調子は？</h2>
              <button
                onClick={() => setShowMentalCheck(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">あなたのコンディションを教えてください。コーチがサポートします。</p>
              
              <div className="grid grid-cols-5 gap-2">
                {[
                  { mood: 5, emoji: '😄', label: '最高' },
                  { mood: 4, emoji: '🙂', label: '良い' },
                  { mood: 3, emoji: '😐', label: '普通' },
                  { mood: 2, emoji: '😔', label: '辛い' },
                  { mood: 1, emoji: '😢', label: 'とても辛い' },
                ].map(({ mood, emoji, label }) => (
                  <button
                    key={mood}
                    onClick={() => {
                      const note = prompt('一言メモ（任意）を入力してください');
                      addMentalCheck(mood, note || '');
                    }}
                    className="aspect-square rounded-xl bg-gray-700 hover:bg-gray-600 border-2 border-gray-600 hover:border-gray-500 transition flex flex-col items-center justify-center"
                  >
                    <div className="text-3xl mb-1">{emoji}</div>
                    <div className="text-xs text-gray-300">{label}</div>
                  </button>
                ))}
              </div>
              
              <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3 text-sm text-gray-300">
                💡 あなたの調子に合わせて、最適なアドバイスをお伝えします
              </div>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default FighterWeightApp;
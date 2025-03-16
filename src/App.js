import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeightTrackerApp = () => {
  // 상태 관리
  const [weight, setWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [weightEntries, setWeightEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substr(0, 10));
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('entry');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [randomQuote, setRandomQuote] = useState('');

  // 체중 관리 명언 목록
  const weightLossQuotes = [
    "오늘의 선택이 당신의 내일을 결정합니다.",
    "체중 감량은 속도가 아닌 꾸준함이 중요합니다.",
    "당신이 포기할 때, 그때가 성공 직전입니다.",
    "한 번에 한 걸음씩, 매일 조금씩 나아가세요.",
    "식습관을 바꾸면 몸이 바뀝니다.",
    "쉬운 길은 결과도 쉽게 사라집니다.",
    "건강한 몸은, 건강한 선택의 결과입니다.",
    "오늘의 땀은 내일의 자신감입니다.",
    "목표를 향해 나아가는 모든 날이 성공의 날입니다.",
    "실패는 포기할 때만 찾아옵니다. 계속 도전하세요."
  ];

  // 로컬 스토리지에서 데이터 불러오기
  useEffect(() => {
    const savedWeightEntries = localStorage.getItem('weightEntries');
    const savedGoalWeight = localStorage.getItem('goalWeight');

    if (savedWeightEntries) {
      setWeightEntries(JSON.parse(savedWeightEntries));
    }

    if (savedGoalWeight) {
      setGoalWeight(savedGoalWeight);
    }

    // 랜덤 명언 선택
    const randomIndex = Math.floor(Math.random() * weightLossQuotes.length);
    setRandomQuote(weightLossQuotes[randomIndex]);
  }, []);

  // 데이터 저장
  useEffect(() => {
    localStorage.setItem('weightEntries', JSON.stringify(weightEntries));
    localStorage.setItem('goalWeight', goalWeight);
  }, [weightEntries, goalWeight]);

  // 알림 표시 함수
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });

    // 3초 후 알림 자동 닫기
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // 체중 추가 함수
  const addWeightEntry = () => {
    if (weight && !isNaN(weight)) {
      const newEntry = {
        id: Date.now(),
        date: selectedDate,
        weight: parseFloat(weight),
        notes: notes
      };

      setWeightEntries([...weightEntries, newEntry]);
      setWeight('');
      setNotes('');
      showNotification('체중이 성공적으로 기록되었습니다.');

      // 새로운 랜덤 명언 선택
      const randomIndex = Math.floor(Math.random() * weightLossQuotes.length);
      setRandomQuote(weightLossQuotes[randomIndex]);
    } else {
      showNotification('유효한 체중을 입력해주세요.', 'error');
    }
  };

  // 체중 항목 삭제 함수
  const deleteEntry = (id) => {
    setWeightEntries(weightEntries.filter(entry => entry.id !== id));
    showNotification('기록이 삭제되었습니다.');
  };

  // 목표 체중 설정 함수
  const setGoal = () => {
    if (goalWeight && !isNaN(goalWeight)) {
      localStorage.setItem('goalWeight', goalWeight);
      showNotification('목표 체중이 설정되었습니다.');
    } else {
      showNotification('유효한 목표 체중을 입력해주세요.', 'error');
    }
  };

  // 체중 변화 계산
  const calculateWeightChange = () => {
    if (weightEntries.length < 2) return 0;

    const sortedEntries = [...weightEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestWeight = sortedEntries[0].weight;
    const previousWeight = sortedEntries[1].weight;

    return (latestWeight - previousWeight).toFixed(1);
  };

  // 목표 달성 비율 계산
  const calculateGoalProgress = () => {
    if (!goalWeight || weightEntries.length === 0) return 0;

    const sortedEntries = [...weightEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestWeight = sortedEntries[0].weight;
    const initialWeight = weightEntries[0].weight;
    const goal = parseFloat(goalWeight);

    if (initialWeight === goal) return 100;

    const totalChange = initialWeight - goal;
    const currentChange = initialWeight - latestWeight;

    return Math.min(100, Math.max(0, (currentChange / totalChange * 100))).toFixed(1);
  };



  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">체중 관리 앱</h1>
      <div className="text-xs text-gray-500 text-center -mt-4 mb-4">버전2</div>

      {/* 알림 메시지 */}
      {notification.show && (
        <div
          className={`mb-4 p-3 rounded text-white font-medium ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
            }`}
        >
          {notification.message}
        </div>
      )}

      {/* 탭 메뉴 */}
      <div className="flex mb-4 border-b">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'entry' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('entry')}
        >
          체중 기록
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('history')}
        >
          기록 확인
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'graph' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('graph')}
        >
          그래프
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'goal' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('goal')}
        >
          목표 설정
        </button>
      </div>

      {/* 체중 입력 탭 */}
      {activeTab === 'entry' && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">오늘의 체중 기록</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">날짜:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">체중 (kg):</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="체중을 입력하세요"
              className="w-full p-2 border rounded"
              step="0.1"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">메모:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="오늘의 특이사항 (선택사항)"
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>

          <button
            onClick={addWeightEntry}
            className="w-full bg-blue-600 text-white p-2 rounded font-medium hover:bg-blue-700"
          >
            기록 저장
          </button>

          {/* 동기부여 명언 */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-center text-blue-700 italic font-medium">"{randomQuote}"</p>
          </div>
        </div>
      )}

      {/* 기록 확인 탭 */}
      {activeTab === 'history' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">체중 기록 내역</h2>

          {weightEntries.length > 0 ? (
            <div>
              {/* 요약 정보 */}
              {weightEntries.length > 1 && (
                <div className="mb-4 p-3 bg-blue-50 rounded">
                  <p className="font-medium">
                    최근 체중 변화:
                    <span className={calculateWeightChange() < 0 ? 'text-green-600' : calculateWeightChange() > 0 ? 'text-red-600' : 'text-gray-600'}>
                      {' '}{calculateWeightChange() > 0 ? '+' : ''}{calculateWeightChange()} kg
                    </span>
                  </p>
                </div>
              )}

              {/* 체중 기록 목록 */}
              <div className="overflow-auto max-h-96">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">날짜</th>
                      <th className="p-2 text-right">체중 (kg)</th>
                      <th className="p-2 text-right">메모</th>
                      <th className="p-2 text-center">삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...weightEntries]
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map(entry => (
                        <tr key={entry.id} className="border-b">
                          <td className="p-2">{entry.date}</td>
                          <td className="p-2 text-right">{entry.weight}</td>
                          <td className="p-2 text-right text-gray-600 max-w-xs truncate">{entry.notes}</td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => deleteEntry(entry.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ⨯
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 my-8">아직 기록이 없습니다.</p>
          )}
        </div>
      )}

      {/* 그래프 탭 */}
      {activeTab === 'graph' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">체중 변화 그래프</h2>

          {weightEntries.length > 1 ? (
            <div className="mb-6">
              <div className="h-64 md:h-72 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[...weightEntries]
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .map(entry => ({
                        date: entry.date,
                        체중: entry.weight,
                      }))}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => {
                        const [year, month, day] = date.split('-');
                        return `${month}/${day}`;
                      }}
                    />
                    <YAxis
                      domain={[
                        (dataMin) => Math.floor(dataMin - 2),
                        (dataMax) => Math.ceil(dataMax + 2)
                      ]}
                      label={{ value: '체중 (kg)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} kg`, '체중']}
                      labelFormatter={(date) => `날짜: ${date}`}
                    />
                    <Legend />
                    <Line
                      type="natural"
                      dataKey="체중"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />

                    {goalWeight && (
                      <Line
                        type="monotone"
                        dataKey={() => parseFloat(goalWeight)}
                        stroke="#10B981"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="목표 체중"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded">
                <h3 className="font-medium mb-2">그래프 분석</h3>
                <p className="text-sm">
                  • 첫 기록(
                  {[...weightEntries].sort((a, b) => new Date(a.date) - new Date(b.date))[0].date}):
                  {[...weightEntries].sort((a, b) => new Date(a.date) - new Date(b.date))[0].weight} kg
                </p>
                <p className="text-sm">
                  • 최근 기록(
                  {[...weightEntries].sort((a, b) => new Date(b.date) - new Date(a.date))[0].date}):
                  {[...weightEntries].sort((a, b) => new Date(b.date) - new Date(a.date))[0].weight} kg
                </p>
                <p className="text-sm">
                  • 총 변화:
                  <span className={
                    ([...weightEntries].sort((a, b) => new Date(b.date) - new Date(a.date))[0].weight -
                      [...weightEntries].sort((a, b) => new Date(a.date) - new Date(b.date))[0].weight) < 0 ?
                      'text-green-600' : 'text-red-600'
                  }>
                    {([...weightEntries].sort((a, b) => new Date(b.date) - new Date(a.date))[0].weight -
                      [...weightEntries].sort((a, b) => new Date(a.date) - new Date(b.date))[0].weight).toFixed(1)} kg
                  </span>
                </p>

                {goalWeight && (
                  <p className="text-sm">
                    • 목표까지:
                    <span className={
                      ([...weightEntries].sort((a, b) => new Date(b.date) - new Date(a.date))[0].weight -
                        parseFloat(goalWeight)) > 0 ?
                        'text-red-600' : 'text-green-600'
                    }>
                      {Math.abs([...weightEntries].sort((a, b) => new Date(b.date) - new Date(a.date))[0].weight -
                        parseFloat(goalWeight)).toFixed(1)} kg
                    </span>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 my-8">
              <p>그래프를 표시하기 위해서는 최소 2개 이상의 체중 기록이 필요합니다.</p>
            </div>
          )}
        </div>
      )}

      {/* 목표 설정 탭 */}
      {activeTab === 'goal' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">목표 체중 설정</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">목표 체중 (kg):</label>
            <input
              type="number"
              value={goalWeight}
              onChange={(e) => setGoalWeight(e.target.value)}
              placeholder="목표 체중을 입력하세요"
              className="w-full p-2 border rounded"
              step="0.1"
            />
          </div>

          <button
            onClick={setGoal}
            className="w-full bg-blue-600 text-white p-2 rounded font-medium hover:bg-blue-700 mb-4"
          >
            목표 설정하기
          </button>

          {/* 목표 진행 상황 */}
          {goalWeight && weightEntries.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">목표 진행 상황</h3>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-green-600 h-4 rounded-full"
                  style={{ width: `${calculateGoalProgress()}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 text-right">
                {calculateGoalProgress()}% 달성
              </p>

              <div className="mt-4 p-3 bg-gray-50 rounded border">
                <p className="mb-1">
                  <span className="font-medium">시작 체중:</span> {weightEntries.length > 0 ? `${weightEntries[0].weight} kg` : '-'}
                </p>
                <p className="mb-1">
                  <span className="font-medium">현재 체중:</span> {weightEntries.length > 0
                    ? `${[...weightEntries].sort((a, b) => new Date(b.date) - new Date(a.date))[0].weight} kg`
                    : '-'}
                </p>
                <p className="mb-1">
                  <span className="font-medium">목표 체중:</span> {goalWeight} kg
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeightTrackerApp;
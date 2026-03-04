import { View, Text } from "react-native";
import theme from "../../data/color-theme";
import { useStreak, toDateKey } from "../../hooks/useStreak";
import { useTaskManager } from "../../hooks/useTaskManager";

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getLast7Days(): string[] {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(toDateKey(d));
    }
    return days;
}

export default function WeeklyFocusWidget() {
    const { tasks } = useTaskManager();
    const { log } = useStreak(tasks);

    const last7Keys = getLast7Days();
    const maxCompleted = Math.max(1, ...last7Keys.map(k => log[k]?.completed ?? 0));

    return (
        <View
            style={{
                marginHorizontal: theme.padding.paddingMainX,
                backgroundColor: theme.text + "08",
                borderRadius: theme.border.radius.main,
                borderWidth: 1,
                borderColor: theme.text + "15",
                padding: 16,
                marginTop: -12
            }}
        >
            <Text
                style={{
                    fontFamily: theme.fonts[500],
                    fontSize: 14,
                    color: theme.text + "90",
                    marginBottom: 24,
                }}
            >
                This Week's Activity
            </Text>

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    gap: 6,
                    height: 110,
                }}
            >
                {last7Keys.map((dateKey, i) => {
                    const record = log[dateKey];
                    const completed = record?.completed ?? 0;
                    const total = record?.total ?? 0;
                    const barH = Math.max(4, Math.round((completed / maxCompleted) * 80));
                    const isToday = i === 6;
                    const isFullDay = total > 0 && completed >= total;
                    const dayName = DAYS_SHORT[new Date(dateKey + "T12:00:00").getDay()];

                    return (
                        <View
                            key={dateKey}
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "flex-end",
                                gap: 5,
                            }}
                        >
                            {completed > 0 && (
                                <Text
                                    style={{
                                        fontFamily: theme.fonts[600],
                                        fontSize: 10,
                                        color: isToday ? theme.primary[3] : theme.text + "60",
                                    }}
                                >
                                    {completed}
                                </Text>
                            )}
                            <View
                                style={{
                                    width: "100%",
                                    borderRadius: 6,
                                    minHeight: 4,
                                    height: barH,
                                    backgroundColor: isToday
                                        ? theme.primary[3]
                                        : isFullDay
                                            ? theme.primary[3]
                                            : theme.text + "18",
                                }}
                            />
                            <Text
                                style={{
                                    fontFamily: isToday ? theme.fonts[600] : theme.fonts[500],
                                    fontSize: 10,
                                    color: isToday ? theme.primary[3] : theme.text + "50",
                                }}
                            >
                                {dayName}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

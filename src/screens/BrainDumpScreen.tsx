import { View, Text, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Trash2, Plus, Lightbulb } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";
import { encryptObject, decryptObject } from "../utils/security";
import theme from "../data/color-theme";

// ─── Types ────────────────────────────────────────────────────────────────────

type DumpEntry = {
    id: number;
    text: string;
    createdAt: string;
};

const STORAGE_KEY = "@taskflow_braindump";

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function BrainDumpScreen() {
    const [entries, setEntries] = useState<DumpEntry[]>([]);
    const [input, setInput] = useState("");

    // ── Load from storage on focus ──
    useFocusEffect(
        useCallback(() => {
            loadEntries();
        }, []),
    );

    const loadEntries = async () => {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const decrypted: DumpEntry[] | null = decryptObject(raw);
            if (decrypted) {
                setEntries(decrypted);
            } else {
                const parsed = JSON.parse(raw);
                setEntries(Array.isArray(parsed) ? parsed : []);
            }
        } catch {
            setEntries([]);
        }
    };

    const persist = async (updated: DumpEntry[]) => {
        try {
            const encrypted = encryptObject(updated);
            await AsyncStorage.setItem(STORAGE_KEY, encrypted);
        } catch { }
    };

    const addEntry = () => {
        const trimmed = input.trim();
        if (!trimmed) return;
        const newEntry: DumpEntry = {
            id: Date.now(),
            text: trimmed,
            createdAt: new Date().toISOString(),
        };
        const updated = [newEntry, ...entries];
        setEntries(updated);
        persist(updated);
        setInput("");
    };

    const deleteEntry = (id: number) => {
        const updated = entries.filter(e => e.id !== id);
        setEntries(updated);
        persist(updated);
    };

    const formatTime = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        const today = new Date();
        const isToday =
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
        if (isToday) return "Today";
        return d.toLocaleDateString([], { month: "short", day: "numeric" });
    };

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.background }}
            edges={["top", "left", "right"]}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                {/* ── Header ─────────────────────────────────── */}
                <View
                    style={{
                        paddingHorizontal: theme.padding.paddingMainX,
                        paddingTop: 12,
                        paddingBottom: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: theme.text + "10",
                    }}
                >
                    <Text
                        style={{
                            fontFamily: theme.fonts[700],
                            fontSize: 24,
                            color: theme.text,
                        }}
                    >
                        Brain Dump
                    </Text>
                    <Text
                        style={{
                            fontFamily: theme.fonts[400],
                            fontSize: 13,
                            color: theme.text + "50",
                            marginTop: 2,
                        }}
                    >
                        Capture every thought, clear your mind
                    </Text>
                </View>

                {/* ── Input area ─────────────────────────────── */}
                <View
                    style={{
                        marginHorizontal: theme.padding.paddingMainX,
                        marginTop: 16,
                        backgroundColor: theme.text + "08",
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: theme.text + "12",
                        flexDirection: "row",
                        alignItems: "flex-end",
                        gap: 10,
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                    }}
                >
                    <Lightbulb
                        size={18}
                        color={theme.primary[1]}
                        strokeWidth={2}
                        style={{ marginBottom: 10 }}
                    />
                    <TextInput
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={addEntry}
                        placeholder="What's on your mind?"
                        placeholderTextColor={theme.text + "35"}
                        multiline
                        returnKeyType="done"
                        blurOnSubmit
                        style={{
                            flex: 1,
                            fontFamily: theme.fonts[400],
                            fontSize: 14,
                            color: theme.text,
                            minHeight: 40,
                            maxHeight: 110,
                            paddingTop: 10,
                            paddingBottom: 10,
                        }}
                    />
                    <Pressable
                        onPress={addEntry}
                        style={({ pressed }) => ({
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: input.trim()
                                ? pressed
                                    ? theme.primary[1] + "CC"
                                    : theme.primary[1]
                                : theme.text + "15",
                            marginBottom: 2,
                        })}
                    >
                        <Plus
                            size={20}
                            color={input.trim() ? theme.background : theme.text + "40"}
                            strokeWidth={2.5}
                        />
                    </Pressable>
                </View>

                {/* ── Entries count ──────────────────────────── */}
                {entries.length > 0 && (
                    <Text
                        style={{
                            fontFamily: theme.fonts[500],
                            fontSize: 11,
                            color: theme.text + "40",
                            letterSpacing: 0.4,
                            textTransform: "uppercase",
                            paddingHorizontal: theme.padding.paddingMainX,
                            marginTop: 20,
                            marginBottom: 8,
                        }}
                    >
                        {entries.length} thought{entries.length !== 1 ? "s" : ""}
                    </Text>
                )}

                {/* ── Entries list ───────────────────────────── */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    overScrollMode="never"
                    contentContainerStyle={{
                        paddingHorizontal: theme.padding.paddingMainX,
                        paddingBottom: 48,
                        gap: 8,
                    }}
                >
                    {entries.length === 0 ? (
                        /* Empty state */
                        <View
                            style={{
                                alignItems: "center",
                                paddingTop: 64,
                                gap: 12,
                            }}
                        >
                            <View
                                style={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: 24,
                                    backgroundColor: theme.primary[1] + "15",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Lightbulb size={32} color={theme.primary[1]} strokeWidth={1.5} />
                            </View>
                            <Text
                                style={{
                                    fontFamily: theme.fonts[600],
                                    fontSize: 16,
                                    color: theme.text + "60",
                                }}
                            >
                                Your mind is clear
                            </Text>
                            <Text
                                style={{
                                    fontFamily: theme.fonts[400],
                                    fontSize: 13,
                                    color: theme.text + "35",
                                    textAlign: "center",
                                    lineHeight: 20,
                                    maxWidth: 240,
                                }}
                            >
                                Type a thought above and tap{" "}
                                <Text style={{ color: theme.primary[1] }}>+</Text> to capture it
                            </Text>
                        </View>
                    ) : (
                        entries.map(entry => (
                            <View
                                key={entry.id}
                                style={{
                                    backgroundColor: theme.text + "07",
                                    borderRadius: 14,
                                    borderWidth: 1,
                                    borderColor: theme.text + "0E",
                                    padding: 14,
                                    flexDirection: "row",
                                    alignItems: "flex-start",
                                    gap: 12,
                                }}
                            >
                                {/* Accent dot */}
                                <View
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: theme.primary[1],
                                        marginTop: 6,
                                        flexShrink: 0,
                                    }}
                                />

                                {/* Text + timestamp */}
                                <View style={{ flex: 1, gap: 4 }}>
                                    <Text
                                        style={{
                                            fontFamily: theme.fonts[400],
                                            fontSize: 14,
                                            color: theme.text,
                                            lineHeight: 21,
                                        }}
                                    >
                                        {entry.text}
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: theme.fonts[400],
                                            fontSize: 11,
                                            color: theme.text + "35",
                                        }}
                                    >
                                        {formatDate(entry.createdAt)} · {formatTime(entry.createdAt)}
                                    </Text>
                                </View>

                                {/* Delete */}
                                <Pressable
                                    onPress={() => deleteEntry(entry.id)}
                                    style={({ pressed }) => ({
                                        padding: 6,
                                        borderRadius: 8,
                                        backgroundColor: pressed ? theme.error + "18" : "transparent",
                                    })}
                                >
                                    <Trash2 size={16} color={theme.text + "35"} strokeWidth={2} />
                                </Pressable>
                            </View>
                        ))
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

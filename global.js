import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const supabase = createClient(
    'https://uuzhdxangctewuklvmlv.supabase.co',
    'sb_publishable_vv0I9z-5PnmOabrpVspufQ_ABmB_F-F'
);

// 상단 바 자동 생성 (로그인 체크 포함)
export async function initHeader(pageTitle) {
    const wrap = document.querySelector('.wrap');
    if (!wrap) return;

    // 안전하게 유저 정보 가져오기
    const { data } = await supabase.auth.getUser();
    const user = data?.user;
    
    let homePath = 'class.html';
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle();
        if (profile?.role === 'admin') homePath = 'admin.html';
    }

    const headerHTML = `
        <div class="global-header" style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; margin-bottom: 15px; border-bottom: 1px solid var(--line);">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800;">${pageTitle}</h1>
            <div class="header-btns" style="display: flex; gap: 8px;">
                <button onclick="location.href='${homePath}'" class="btn-std">학습 홈</button>
                <button id="globalLogoutBtn" class="btn-std btn-fill-slate">로그아웃</button>
            </div>
        </div>
    `;
    wrap.insertAdjacentHTML('afterbegin', headerHTML);

    document.getElementById('globalLogoutBtn').onclick = async () => {
        if(confirm('로그아웃 하시겠습니까?')) {
            await supabase.auth.signOut();
            location.href = 'login.html';
        }
    };
}

// 통합 알림창
export function showAlert(title, msg, isError = false, onConfirm = null) {
    let modal = document.getElementById('globalModal');
    if (!modal) {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="globalModal">
                <div class="g-modal-content">
                    <h3 id="gTitle" class="g-modal-title"></h3>
                    <p id="gMsg" class="g-modal-msg"></p>
                    <button id="gYes" class="g-modal-btn" style="background:#4caf50; color:white;">확인</button>
                </div>
            </div>
        `);
        modal = document.getElementById('globalModal');
    }

    const titleEl = document.getElementById('gTitle');
    titleEl.textContent = title;
    titleEl.style.color = isError ? '#ef4444' : '#1f2937';
    document.getElementById('gMsg').textContent = msg;
    
    document.getElementById('gYes').onclick = () => {
        modal.style.display = 'none';
        if (onConfirm) onConfirm();
    };
    modal.style.display = 'flex';
}

// 보안 설정
export function initSecurity(inputEl = null) {
    document.addEventListener('copy', (e) => e.preventDefault());
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    if (inputEl) {
        inputEl.addEventListener('paste', (e) => {
            e.preventDefault();
            showAlert('알림', '직접 타이핑해야 학습 효과가 좋습니다!', true);
        });
        inputEl.addEventListener('drop', (e) => e.preventDefault());
    }
}

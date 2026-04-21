import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const supabase = createClient(
    'https://uuzhdxangctewuklvmlv.supabase.co',
    'sb_publishable_vv0I9z-5PnmOabrpVspufQ_ABmB_F-F'
);

export async function initHeader(pageTitle) {
    const wrap = document.querySelector('.wrap');
    if (!wrap) return;

    const { data } = await supabase.auth.getUser();
    const user = data?.user;
    
    let homePath = 'class.html';
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle();
        if (profile?.role === 'admin') homePath = 'admin.html';
    }

    const headerHTML = `
        <div class="topbar">
            <h1>${pageTitle}</h1>
            <div class="btns">
                <button onclick="location.href='${homePath}'" class="btn-light">학습 홈</button>
                <button id="globalLogoutBtn" class="btn-slate">로그아웃</button>
            </div>
        </div>
    `;
    // 기존 내용을 지우지 않고 맨 위에 추가
    wrap.insertAdjacentHTML('afterbegin', headerHTML);

    document.getElementById('globalLogoutBtn').onclick = async () => {
        if(confirm('로그아웃 하시겠습니까?')) {
            await supabase.auth.signOut();
            location.href = 'login.html';
        }
    };
}

export function showAlert(title, msg, isError = false, onConfirm = null) {
    let modal = document.getElementById('globalModal');
    if (!modal) {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="globalModal">
                <div class="modal-content">
                    <h3 id="gTitle" style="margin:0 0 10px 0; font-size:22px; font-weight:800;"></h3>
                    <p id="gMsg" style="margin:0 0 20px 0; line-height:1.6; color:#475569;"></p>
                    <button id="gYes" class="m-btn" style="background:#4caf50; color:white;">확인</button>
                </div>
            </div>
        `);
        modal = document.getElementById('globalModal');
    }

    const tEl = document.getElementById('gTitle');
    tEl.textContent = title;
    tEl.style.color = isError ? '#ef4444' : '#4caf50';
    document.getElementById('gMsg').textContent = msg;
    
    document.getElementById('gYes').onclick = () => {
        modal.style.display = 'none';
        if (onConfirm) onConfirm();
    };
    modal.style.display = 'flex';
}

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

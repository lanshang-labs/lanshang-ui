import { useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
import { Skeleton as AntSkeleton, type SkeletonProps as AntSkeletonProps } from 'antd';
export type SkeletonProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> & {
    loading?: boolean;
    children?: ReactNode;
    /** Visual-only placeholder. Keep interactive controls outside the template. */
    template?: ReactNode;
    delay?: number;
    label?: string;
    active?: boolean;
    avatar?: AntSkeletonProps['avatar'];
    title?: AntSkeletonProps['title'];
    paragraph?: AntSkeletonProps['paragraph'];
};
/** Reserves the placeholder geometry during delay; never exposes stale children while loading. */
export function Skeleton({ loading = true, children, template, delay = 150, label = '正在加载', active = true, avatar = false, title = true, paragraph = { rows: 3 }, className = '', ...props }: SkeletonProps) {
    const wait = Number.isFinite(delay) ? Math.max(0, delay) : 150;
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        setVisible(false);
        if (!loading || wait === 0)
            return;
        const timer = setTimeout(() => setVisible(true), wait);
        return () => clearTimeout(timer);
    }, [loading, wait]);
    return <div {...props} className={`ls-skeleton ${className}`} aria-busy={loading}>
    {loading ? <>
      <span className="ls-skeleton-label" role="status">{label}</span>
      <div aria-hidden="true" className="ls-skeleton-placeholder" style={{ visibility: wait === 0 || visible ? 'visible' : 'hidden' }}>
        {template ?? <AntSkeleton active={active} avatar={avatar} title={title} paragraph={paragraph}/>}
      </div>
    </> : children}
  </div>;
}
